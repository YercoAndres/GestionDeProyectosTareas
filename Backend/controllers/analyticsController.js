const connection = require('../config/db');
const TimeEntry = require('../models/TimeEntryModel');

const normaliseProjectStatus = (status) => {
  if (!status) return 'Sin estado';
  const lower = status.toLowerCase();
  if (lower.includes('pausa')) return 'En Pausa';
  if (lower.includes('complet')) return 'Completado';
  if (lower.includes('progreso')) return 'En Progreso';
  return status;
};

const normaliseTaskStatus = (status) => {
  if (!status) return 'pendiente';
  const lower = status.toLowerCase();
  if (lower.includes('complet')) return 'completado';
  if (lower.includes('progreso')) return 'en progreso';
  return status;
};

const getOverviewMetrics = async (_req, res) => {
  try {
    const projectStatusPromise = new Promise((resolve, reject) => {
      connection.query(
        'SELECT status, COUNT(*) AS total FROM projects GROUP BY status',
        (err, rows) => {
          if (err) return reject(err);
          const summary = rows.reduce((acc, row) => {
            const status = normaliseProjectStatus(row.status);
            acc[status] = (acc[status] || 0) + row.total;
            return acc;
          }, {});
          resolve(summary);
        }
      );
    });

    const taskTotalsPromise = new Promise((resolve, reject) => {
      connection.query(
        'SELECT COUNT(*) AS totalTasks, COALESCE(SUM(estimated_hours), 0) AS estimatedHours FROM tasks',
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows[0]);
        }
      );
    });

    const timeTotalsPromise = new Promise((resolve, reject) => {
      connection.query(
        'SELECT COALESCE(SUM(duration_minutes), 0) AS totalMinutes FROM time_entries',
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows[0]);
        }
      );
    });

    const [projectStatus, taskTotals, timeTotals] = await Promise.all([
      projectStatusPromise,
      taskTotalsPromise,
      timeTotalsPromise,
    ]);

    res.json({
      projectsByStatus: projectStatus,
      totalTasks: Number(taskTotals.totalTasks) || 0,
      totalEstimatedHours: Number(taskTotals.estimatedHours) || 0,
      totalLoggedHours: Number((timeTotals.totalMinutes || 0) / 60).toFixed(2),
    });
  } catch (error) {
    console.error('Error al obtener métricas generales:', error);
    res
      .status(500)
      .json({ message: 'Error al obtener las métricas generales' });
  }
};

const getProjectAnalytics = async (req, res) => {
  const { projectId } = req.params;

  const tasksPromise = new Promise((resolve, reject) => {
    const query = `
      SELECT id, name, estado, estimated_hours, story_points, end_date
      FROM tasks
      WHERE project_id = ?
    `;
    connection.query(query, [projectId], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });

  try {
    const [tasks, summary, grouped] = await Promise.all([
      tasksPromise,
      new Promise((resolve, reject) => {
        TimeEntry.getSummaryByProject(projectId, (err, rows) => {
          if (err) return reject(err);
          resolve(rows[0] || { total_minutes: 0, entry_count: 0 });
        });
      }),
      new Promise((resolve, reject) => {
        TimeEntry.getSummaryByProjectGrouped(projectId, (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        });
      }),
    ]);

    const statusBreakdown = tasks.reduce(
      (acc, task) => {
        const status = normaliseTaskStatus(task.estado);
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      { 'en progreso': 0, completado: 0, pendiente: 0 }
    );

    const totalEstimatedHours = tasks.reduce(
      (acc, task) => acc + (Number(task.estimated_hours) || 0),
      0
    );
    const totalStoryPoints = tasks.reduce(
      (acc, task) => acc + (Number(task.story_points) || 0),
      0
    );

    const tasksDueSoon = tasks
      .filter((task) => {
        if (!task.end_date) return false;
        const endDate = new Date(task.end_date);
        const now = new Date();
        const diffDays = (endDate - now) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      })
      .map((task) => ({
        id: task.id,
        name: task.name,
        endDate: task.end_date,
        status: task.estado,
      }));

    res.json({
      projectId: Number(projectId),
      totals: {
        tasks: tasks.length,
        status: statusBreakdown,
        estimatedHours: totalEstimatedHours,
        storyPoints: totalStoryPoints,
        loggedMinutes: summary.total_minutes || 0,
        loggedHours: Number((summary.total_minutes || 0) / 60).toFixed(2),
        timeEntryCount: summary.entry_count || 0,
      },
      timeByUser: grouped.map((row) => ({
        userId: row.user_id,
        totalMinutes: row.total_minutes || 0,
      })),
      tasksDueSoon,
    });
  } catch (error) {
    console.error('Error al obtener analíticas del proyecto:', error);
    res
      .status(500)
      .json({ message: 'Error al obtener las analíticas del proyecto' });
  }
};

module.exports = {
  getOverviewMetrics,
  getProjectAnalytics,
};


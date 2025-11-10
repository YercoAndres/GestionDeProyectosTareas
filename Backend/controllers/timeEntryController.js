const TimeEntry = require('../models/TimeEntryModel');

const parseDuration = (startedAt, endedAt, durationMinutes) => {
  if (Number.isFinite(durationMinutes) && durationMinutes > 0) {
    return Math.round(durationMinutes);
  }
  if (startedAt && endedAt) {
    const start = new Date(startedAt);
    const end = new Date(endedAt);
    const diffMs = end.getTime() - start.getTime();
    if (Number.isFinite(diffMs) && diffMs > 0) {
      return Math.max(1, Math.round(diffMs / 60000));
    }
  }
  return null;
};

const createTimeEntry = (req, res) => {
  const {
    taskId,
    projectId,
    userId,
    startedAt,
    endedAt = null,
    durationMinutes = null,
    note = '',
  } = req.body;

  if (!taskId || !projectId || !userId || !startedAt) {
    return res.status(400).json({
      message:
        'taskId, projectId, userId y startedAt son obligatorios para registrar tiempo.',
    });
  }

  const parsedDuration = parseDuration(startedAt, endedAt, durationMinutes);
  if (!parsedDuration) {
    return res.status(400).json({
      message:
        'Proporciona endedAt válido o durationMinutes mayor a cero para calcular la duración.',
    });
  }

  const entryPayload = {
    taskId,
    projectId,
    userId,
    startedAt,
    endedAt,
    durationMinutes: parsedDuration,
    note,
  };

  TimeEntry.createTimeEntry(entryPayload, (err, result) => {
    if (err) {
      console.error('Error al registrar tiempo:', err);
      return res
        .status(500)
        .json({ message: 'Error al registrar el tiempo', error: err.message });
    }
    return res.status(201).json({
      id: result.insertId,
      ...entryPayload,
    });
  });
};

const getTimeEntriesByTask = (req, res) => {
  const { taskId } = req.params;
  TimeEntry.getEntriesByTask(taskId, (err, rows) => {
    if (err) {
      console.error('Error al obtener tiempos por tarea:', err);
      return res
        .status(500)
        .json({ message: 'Error al obtener registros de tiempo' });
    }
    return res.json(rows);
  });
};

const getTimeEntriesByProject = (req, res) => {
  const { projectId } = req.params;
  TimeEntry.getEntriesByProject(projectId, (err, rows) => {
    if (err) {
      console.error('Error al obtener tiempos por proyecto:', err);
      return res
        .status(500)
        .json({ message: 'Error al obtener registros de tiempo' });
    }
    return res.json(rows);
  });
};

const getTimeSummaryByProject = (req, res) => {
  const { projectId } = req.params;
  TimeEntry.getSummaryByProject(projectId, (err, summaryRows) => {
    if (err) {
      console.error('Error al calcular el resumen de tiempo:', err);
      return res
        .status(500)
        .json({ message: 'Error al calcular el resumen de tiempo' });
    }

    TimeEntry.getSummaryByProjectGrouped(projectId, (groupErr, groupRows) => {
      if (groupErr) {
        console.error(
          'Error al agrupar el resumen de tiempo por usuario:',
          groupErr
        );
        return res.status(500).json({
          message: 'Error al agrupar el resumen de tiempo por usuario',
        });
      }

      const summary =
        summaryRows && summaryRows.length > 0
          ? summaryRows[0]
          : { total_minutes: 0, entry_count: 0 };

      return res.json({
        totalMinutes: summary.total_minutes || 0,
        entryCount: summary.entry_count || 0,
        byUser: groupRows.map((row) => ({
          userId: row.user_id,
          totalMinutes: row.total_minutes || 0,
        })),
      });
    });
  });
};

module.exports = {
  createTimeEntry,
  getTimeEntriesByTask,
  getTimeEntriesByProject,
  getTimeSummaryByProject,
};


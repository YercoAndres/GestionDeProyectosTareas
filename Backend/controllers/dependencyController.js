const TaskDependency = require('../models/TaskDependencyModel');

const getDependencies = (req, res) => {
  const { projectId } = req.params;
  if (!projectId || projectId === 'undefined') {
    return res.status(400).json({ message: 'projectId requerido' });
  }
  TaskDependency.getDependenciesByProject(projectId, (err, rows) => {
    if (err) {
      console.error('Error al obtener dependencias:', err);
      return res
        .status(500)
        .json({ message: 'Error al obtener las dependencias del proyecto' });
    }
    res.json(rows || []);
  });
};

const createDependency = (req, res) => {
  const { taskId, dependsOnTaskId, dependencyType, note } = req.body;

  if (!taskId || !dependsOnTaskId) {
    return res
      .status(400)
      .json({ message: 'Tarea y dependencia son obligatorias' });
  }
  if (Number(taskId) === Number(dependsOnTaskId)) {
    return res
      .status(400)
      .json({ message: 'Una tarea no puede depender de sí misma' });
  }

  TaskDependency.createDependency(
    {
      taskId,
      dependsOnTaskId,
      dependencyType: dependencyType || 'FS',
      note: note || '',
    },
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res
            .status(409)
            .json({ message: 'La dependencia ya existe' });
        }
        console.error('Error al crear dependencia:', err);
        return res
          .status(500)
          .json({ message: 'Error al crear la dependencia' });
      }
      res.status(201).json({
        id: result.insertId,
        message: 'Dependencia creada correctamente',
      });
    }
  );
};

const deleteDependency = (req, res) => {
  const { dependencyId } = req.params;
  TaskDependency.deleteDependency(dependencyId, (err, result) => {
    if (err) {
      console.error('Error al eliminar dependencia:', err);
      return res
        .status(500)
        .json({ message: 'Error al eliminar la dependencia' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dependencia no encontrada' });
    }
    res.json({ message: 'Dependencia eliminada correctamente' });
  });
};

const buildCriticalPath = (projectId, callback) => {
  TaskDependency.getDependencyGraph(projectId, (err, rows) => {
    if (err) return callback(err);
    const tasks = new Map();
    const adjacency = new Map();
    const indegree = new Map();

    rows.forEach((row) => {
      if (!tasks.has(row.id)) {
        tasks.set(row.id, {
          id: row.id,
          name: row.name,
          estimated_hours:
            row.estimated_hours !== null ? Number(row.estimated_hours) : null,
          start_date: row.start_date,
          end_date: row.end_date,
        });
        adjacency.set(row.id, []);
        indegree.set(row.id, 0);
      }
    });

    rows.forEach((row) => {
      if (row.depends_on_task_id) {
        const list = adjacency.get(row.depends_on_task_id) || [];
        list.push({
          id: row.id,
          dependency_type: row.dependency_type,
        });
        adjacency.set(row.depends_on_task_id, list);
        indegree.set(row.id, (indegree.get(row.id) || 0) + 1);
      }
    });

    const queue = [];
    indegree.forEach((value, key) => {
      if (value === 0) {
        queue.push(key);
      }
    });

    const order = [];
    while (queue.length > 0) {
      const node = queue.shift();
      order.push(node);
      (adjacency.get(node) || []).forEach((edge) => {
        const next = edge.id;
        indegree.set(next, (indegree.get(next) || 0) - 1);
        if (indegree.get(next) === 0) {
          queue.push(next);
        }
      });
    }

    if (order.length !== tasks.size) {
      return callback(null, {
        criticalPath: [],
        message:
          'No se pudo calcular la ruta crítica debido a una dependencia cíclica.',
      });
    }

    const durations = new Map();
    tasks.forEach((task, id) => {
      let duration = Number(task.estimated_hours);
      if (!Number.isFinite(duration) || duration <= 0) {
        if (task.start_date && task.end_date) {
          const start = new Date(task.start_date);
          const end = new Date(task.end_date);
          const diffDays = Math.max(
            0,
            Math.round((end.getTime() - start.getTime()) / 86400000)
          );
          duration = diffDays || 1;
        } else {
          duration = 1;
        }
      }
      durations.set(id, duration);
    });

    const longest = new Map();
    const predecessor = new Map();
    order.forEach((taskId) => {
      longest.set(taskId, durations.get(taskId) || 1);
    });

    order.forEach((taskId) => {
      const currentDuration = longest.get(taskId);
      (adjacency.get(taskId) || []).forEach((edge) => {
        const candidate = currentDuration + (durations.get(edge.id) || 1);
        if (candidate > (longest.get(edge.id) || 0)) {
          longest.set(edge.id, candidate);
          predecessor.set(edge.id, taskId);
        }
      });
    });

    let maxTask = null;
    let maxDuration = -Infinity;
    longest.forEach((value, key) => {
      if (value > maxDuration) {
        maxTask = key;
        maxDuration = value;
      }
    });

    const path = [];
    let cursor = maxTask;
    while (cursor !== undefined && cursor !== null) {
      path.unshift(cursor);
      cursor = predecessor.get(cursor);
    }

    const criticalPath = path.map((taskId) => {
      const task = tasks.get(taskId);
      return {
        id: taskId,
        name: task?.name || `Tarea ${taskId}`,
        estimatedHours: durations.get(taskId),
      };
    });

    callback(null, {
      criticalPath,
      totalDuration: maxDuration,
    });
  });
};

const getCriticalPath = (req, res) => {
  const { projectId } = req.params;
  if (!projectId || projectId === 'undefined') {
    return res.status(400).json({ message: 'projectId requerido' });
  }
  buildCriticalPath(projectId, (err, result) => {
    if (err) {
      console.error('Error al calcular la ruta crítica:', err);
      return res
        .status(500)
        .json({ message: 'Error al calcular la ruta crítica' });
    }
    res.json(result);
  });
};

module.exports = {
  getDependencies,
  createDependency,
  deleteDependency,
  getCriticalPath,
};

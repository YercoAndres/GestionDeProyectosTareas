const Task = require("../models/TaskModel");
const Project = require("../models/ProjectModel"); // Asegúrate de tener un modelo de proyecto

// Función para crear una tarea
const createTask = (req, res) => {
  const { projectId } = req.params;
  const newTask = {
    projectId,
    name: req.body.name,
    description: req.body.description,
    start_date: req.body.start_date,
    end_date: req.body.end_date,
    estimated_hours: req.body.estimated_hours || null,
    story_points: req.body.story_points || null,
    priority: req.body.priority,
    estado: req.body.estado || "en progreso",
    responsable_id: req.body.responsable_id,
  };

  Task.createTask(newTask, (err, results) => {
    if (err) {
      console.error("Error al crear la tarea:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, ...newTask });
  });
};

// Función para obtener las tareas de un proyecto
const getTasksByProjectId = (req, res) => {
  const { projectId } = req.params;
  if (projectId === undefined || projectId === null || projectId === 'undefined') {
    return res.status(400).json({ message: "projectId requerido" });
  }
  Task.getTasksByProjectId(projectId, (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(tasks);
  });
};

// Función para obtener todas las tareas
const getAllTasks = (req, res) => {
  Task.getAllTasks((err, tasks) => {
    if (err) {
      return res.status(500).json({ message: "Error al obtener las tareas" });
    }
    res.json(tasks);
  });
};

// Función para eliminar una tarea
const deleteTask = (req, res) => {
  const { taskId } = req.params;
  Task.deleteTask(taskId, (err, result) => {
    if (err) {
      console.error("Error al eliminar la tarea:", err);
      return res.status(500).json({ message: "Error al eliminar la tarea" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }
    res.status(200).json({ message: "Tarea eliminada correctamente" });
  });
};

// Función para actualizar una tarea
const updateTask = (req, res) => {
  const { taskId } = req.params;
  const updatedTask = {
    ...req.body,
    estimated_hours: req.body.estimated_hours || null,
    story_points: req.body.story_points || null,
  };

  Task.updateTask(taskId, updatedTask, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Error al actualizar la tarea" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    // Verificar si todas las tareas del proyecto están completadas
    Task.getTasksByProjectId(updatedTask.projectId, (err, tasks) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error al verificar las tareas del proyecto" });
      }

      const allCompleted = tasks.every((task) => task.estado === "completado");
      if (allCompleted) {
        Project.updateProjectStatus(
          updatedTask.projectId,
          "completado",
          (err) => {
            if (err) {
              return res.status(500).json({
                message: "Error al actualizar el estado del proyecto",
              });
            }
            res.status(200).json({
              message: "Tarea y estado del proyecto actualizados correctamente",
            });
          }
        );
      } else {
        res.status(200).json({ message: "Tarea actualizada correctamente" });
      }
    });
  });
};

module.exports = {
  createTask,
  getTasksByProjectId,
  getAllTasks,
  updateTask,
  deleteTask,
};

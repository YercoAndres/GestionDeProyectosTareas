const Task = require('../models/TaskModel'); 

// Función para crear una tarea
const createTask = (req, res) => {
  const { projectId } = req.params;
  const newTask = { 
    projectId, 
    name: req.body.name, 
    description: req.body.description, 
    start_date: req.body.start_date, 
    end_date: req.body.end_date, 
    priority: req.body.priority 
  }; 

  Task.createTask(newTask, (err, results) => {
    if (err) {
      console.error('Error al crear la tarea:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, ...newTask });
  });
};

// Función para obtener las tareas de un proyecto
const getTasksByProjectId = (req, res) => {
  const { projectId } = req.params;
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
      return res.status(500).json({ message: 'Error al obtener las tareas' });
    }
    res.json(tasks);
  });
};
const deleteTask = (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM tasks WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error al eliminar la tarea:', error);
      return res.status(500).json({ message: 'Error al eliminar la tarea' });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  });
};

module.exports = { createTask, getTasksByProjectId, getAllTasks, deleteTask };
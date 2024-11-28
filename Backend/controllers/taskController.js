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

module.exports = { createTask, getTasksByProjectId, getAllTasks };
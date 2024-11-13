// taskController.js
const Task = require('../models/TaskModel'); // Asegúrate de que el modelo de Task esté importado

// Función para crear una tarea
const createTask = (req, res) => {
  const { projectId } = req.params;
  const newTask = { projectId, taskDescription: req.body.taskDescription }; // Cambiado a taskDescription
  console.log('Datos recibidos:', newTask);  // Agregar console log aquí

  Task.createTask(newTask, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, ...newTask });
  });
};


module.exports = { createTask };

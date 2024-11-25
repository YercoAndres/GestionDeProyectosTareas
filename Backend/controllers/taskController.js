// Propósito: Controlador de tareas
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
  // console.log('Datos recibidos:', newTask);   Con este verificamos que los datos se estén recibiendo correctamente

  Task.createTask(newTask, (err, results) => { // Task es el modelo que contiene la función createTask se le pasa el objeto newTask y un callback
    if (err) {
      console.error('Error al crear la tarea:', err); // Agrega este log para ver el error en la consola del servidor
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, ...newTask });
  });
};


module.exports = { createTask };

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


getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // Aquí deberías obtener las tareas desde tu base de datos
    res.json(tasks); // Envía las tareas como respuesta en formato JSON
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
};



module.exports = { createTask, getTasksByProjectId, getTasks };

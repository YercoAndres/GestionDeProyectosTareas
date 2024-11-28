const connection = require('../config/db');

// Función para crear una tarea
const createTask = (task, callback) => {  
  const { projectId, name, description, start_date, end_date, priority } = task;
  connection.query(
    'INSERT INTO tasks (project_id, name, description, start_date, end_date, priority) VALUES (?, ?, ?, ?, ?, ?)', 
    [projectId, name, description, start_date, end_date, priority], 
    callback
  );
};

// Función para obtener las tareas de un proyecto
const getTasksByProjectId = (projectId, callback) => {
  connection.query('SELECT * FROM tasks WHERE project_id = ?', [projectId], callback);
};

// Función para obtener todas las tareas
const getAllTasks = (callback) => {
  connection.query('SELECT * FROM tasks', callback);
};

// Función para eliminar las tareas de un proyecto
const deleteTasksByProjectId = (projectId, callback) => {
  connection.query('DELETE FROM tasks WHERE project_id = ?', [projectId], callback);
};

module.exports = {
  createTask,
  getTasksByProjectId,
  getAllTasks,
  deleteTasksByProjectId
};
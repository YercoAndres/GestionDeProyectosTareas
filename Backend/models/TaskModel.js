const connection = require('../config/db');

// Función para crear una tarea
const createTask = (task, callback) => {  
  const { projectId, name, description, start_date, end_date, priority, estado } = task;
  connection.query(
    'INSERT INTO tasks (project_id, name, description, start_date, end_date, priority, estado) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [projectId, name, description, start_date, end_date, priority, estado], 
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

const deleteTask = (taskId, callback) => {
  connection.query('DELETE FROM tasks WHERE id = ?', [taskId], callback);
};

const updateTask = (taskId, task, callback) => {
  const { name, description, start_date, end_date, priority, estado } = task;
  connection.query(
    'UPDATE tasks SET name = ?, description = ?, start_date = ?, end_date = ?, priority = ?, estado = ? WHERE id = ?',
    [name, description, start_date, end_date, priority, estado, taskId],
    callback
  );
};

module.exports = {
  createTask,
  getTasksByProjectId,
  getAllTasks,
  deleteTasksByProjectId,
  deleteTask,
  updateTask
};
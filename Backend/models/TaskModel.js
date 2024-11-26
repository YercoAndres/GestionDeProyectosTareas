// Proposito Modelo de la tabla tasks
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

const getTasksByProjectId = (projectId, callback) => {
  connection.query('SELECT * FROM tasks WHERE project_id = ?', [projectId], callback);
};

getTasks = (req, res) => {
  db.query('SELECT * FROM tasks', (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Error al obtener las tareas' });
    }
    res.json(result);
  });
};

const deleteTasksByProjectId = (projectId, callback) => {
  connection.query('DELETE FROM tasks WHERE project_id = ?', [projectId], callback);
};

module.exports = {
  createTask,
  deleteTasksByProjectId,
  getTasksByProjectId
};

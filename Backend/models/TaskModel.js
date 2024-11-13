const connection = require('../config/db');


const createTask = (task, callback) => {
  const { projectId, taskDescription } = task;
  connection.query('INSERT INTO tasks (project_id, task) VALUES (?, ?)', [projectId, taskDescription], callback);
};



const deleteTasksByProjectId = (projectId, callback) => {
  connection.query('DELETE FROM tasks WHERE project_id = ?', [projectId], callback);
};

module.exports = {
  createTask,
  deleteTasksByProjectId,
};

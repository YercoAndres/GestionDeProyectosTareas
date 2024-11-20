const connection = require('../config/db');

const getAllProjects = (callback) => {
  connection.query('SELECT * FROM projects', callback);
};

const createProject = (project, callback) => {
  const { name, description, start_Date, end_Date, members } = project;
  const query = 'INSERT INTO projects (name, description, start_date, end_date, members) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, description, start_Date, end_Date, members], (err, results) => {
    if (err) return callback(err);
    callback(null, results.insertId);
  });
};

const updateProject = (id, project, callback) => {
  const { name, description } = project;
  connection.query('UPDATE projects SET name = ?, description = ? WHERE id = ?', [name, description, id], callback);
};

const deleteProject = (id, callback) => {
  connection.query('DELETE FROM projects WHERE id = ?', [id], callback);
};

const getProjectsByUserId = (userId, callback) => {
  const query = `
    SELECT p.* FROM projects p
    JOIN project_members pm ON p.id = pm.project_id
    WHERE pm.user_id = ?
  `;
  connection.query(query, [userId], callback);
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUserId,
};

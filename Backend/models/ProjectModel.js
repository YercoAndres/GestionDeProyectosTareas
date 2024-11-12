
const connection = require('../config/db');

const getAllProjects = (callback) => {
  connection.query('SELECT * FROM projects', callback);
};

const createProject = (project, callback) => {
  const { name, description } = project;
  connection.query('INSERT INTO projects (name, description) VALUES (?, ?)', [name, description], callback);
};

const updateProject = (id, project, callback) => {
  const { name, description } = project;
  connection.query('UPDATE projects SET name = ?, description = ? WHERE id = ?', [name, description, id], callback);
};

const deleteProject = (id, callback) => {
    // Primero eliminamos las tareas asociadas con el proyecto
    connection.query('DELETE FROM tasks WHERE project_id = ?', [id], (error) => {
      if (error) {
        return callback(error);
      }
  
      // Después eliminamos el proyecto
      connection.query('DELETE FROM projects WHERE id = ?', [id], callback);
    });
  };
  

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
};

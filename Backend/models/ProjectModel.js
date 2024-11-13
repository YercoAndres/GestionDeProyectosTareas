const connection = require('../config/db');




const getAllProjects = (callback) => {
  connection.query('SELECT * FROM projects', callback);
};

const createProject = (project, callback) => {
  const { name, description, startDate, endDate, members } = project;
  const query = 'INSERT INTO projects (name, description, start_date, end_date, members) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, description, startDate, endDate, members], (err, results) => {
    if (err) return callback(err);
    callback(null, results.insertId);
  });
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

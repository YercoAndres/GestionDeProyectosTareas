const connection = require('../config/db');

const getAllProjects = (callback) => {
  connection.query('SELECT * FROM projects', callback);
};

const createProject = (project, callback) => {
  const { name, description, start_Date, end_Date, members, status } = project;
  const query = 'INSERT INTO projects (name, description, start_date, end_date, members, status) VALUES (?, ?, ?, ?, ?, ?)';
  connection.query(query, [name, description, start_Date, end_Date, members, status], (err, results) => {
    if (err) return callback(err);
    callback(null, results.insertId);
  });
};

const updateProject = (id, project, callback) => {
  const { name, description } = project;
  connection.query('UPDATE projects SET name = ?, description = ? WHERE id = ?', [name, description, id], callback);
};

const deleteProject = (id, callback) => {
  connection.beginTransaction(err => {
    if (err) return callback(err);

    connection.query('DELETE FROM tasks WHERE project_id = ?', [id], (err, result) => {
      if (err) {
        return connection.rollback(() => {
          callback(err);
        });
      }

      // Elimina las filas relacionadas en project_members
      connection.query('DELETE FROM project_members WHERE project_id = ?', [id], (err, result) => {
        if (err) {
          return connection.rollback(() => {
            callback(err);
          });
        }

        // Elimina el proyecto
        connection.query('DELETE FROM projects WHERE id = ?', [id], (err, result) => {
          if (err) {
            return connection.rollback(() => {
              callback(err);
            });
          }

          connection.commit(err => {
            if (err) {
              return connection.rollback(() => {
                callback(err);
              });
            }
            callback(null, result);
          });
        });
      });
    });
  }); // <-- Aquí cierra la función beginTransaction
};

const getProjectsByUserId = (userId, callback) => {
  const query = `
    SELECT p.* FROM projects p
    JOIN project_members pm ON p.id = pm.project_id
    WHERE pm.user_id = ?
  `;
  connection.query(query, [userId], callback);
};

const updateProjectStatus = (projectId, status, callback) => {
  connection.query(
    'UPDATE projects SET status = ? WHERE id = ?',
    [status, projectId],
    callback
  );
};

const getProjectMembers = (projectId, callback) => {
  const query = `
    SELECT u.id, u.name 
    FROM project_members pm
    JOIN users u ON pm.user_id = u.id
    WHERE pm.project_id = ?
  `;
  connection.query(query, [projectId], (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return callback(err);
    }
    callback(null, results);
  });
};


module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectsByUserId,
  updateProjectStatus,
  getProjectMembers
};

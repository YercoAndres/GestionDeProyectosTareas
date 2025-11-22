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
  const {
    name,
    description = '',
    startDate,
    start_date,
    endDate,
    end_date,
    status,
    members,
  } = project;

  const normalizedStartDate = startDate || start_date || null;
  const normalizedEndDate = endDate || end_date || null;
  const normalizedStatus = status || project.status || 'En Progreso';
  const memberAssignments = Array.isArray(members)
    ? members
        .map((member) => {
          if (member && typeof member === 'object') {
            const userId = Number(
              member.userId ?? member.id ?? member.user_id ?? member.memberId
            );
            const roleId =
              member.roleId ?? member.role_id ?? member.roleId ?? null;
            if (!Number.isNaN(userId) && userId > 0) {
              return {
                userId,
                roleId: roleId ? Number(roleId) : null,
              };
            }
            return null;
          }
          const numericId = Number(member);
          if (Number.isNaN(numericId) || numericId <= 0) {
            return null;
          }
          return { userId: numericId, roleId: null };
        })
        .filter(Boolean)
    : [];

  connection.beginTransaction((err) => {
    if (err) return callback(err);

    const updateProjectQuery =
      'UPDATE projects SET name = ?, description = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?';

    connection.query(
      updateProjectQuery,
      [name, description, normalizedStartDate, normalizedEndDate, normalizedStatus, id],
      (updateErr) => {
        if (updateErr) {
          return connection.rollback(() => {
            callback(updateErr);
          });
        }

        const deleteMembersQuery = 'DELETE FROM project_members WHERE project_id = ?';
        connection.query(deleteMembersQuery, [id], (deleteErr) => {
          if (deleteErr) {
            return connection.rollback(() => {
              callback(deleteErr);
            });
          }

          if (!memberAssignments.length) {
            return connection.commit((commitErr) => {
              if (commitErr) {
                return connection.rollback(() => {
                  callback(commitErr);
                });
              }
              callback(null, { affectedRows: 1 });
            });
          }

          const insertMembersQuery =
            'INSERT INTO project_members (project_id, user_id, role_id) VALUES ?';
          const insertValues = memberAssignments.map((member) => [
            id,
            member.userId,
            member.roleId,
          ]);

          connection.query(insertMembersQuery, [insertValues], (insertErr) => {
            if (insertErr) {
              return connection.rollback(() => {
                callback(insertErr);
              });
            }

            connection.commit((commitErr) => {
              if (commitErr) {
                return connection.rollback(() => {
                  callback(commitErr);
                });
              }
              callback(null, { affectedRows: 1 });
            });
          });
        });
      }
    );
  });
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
    SELECT 
      u.id,
      u.name,
      u.email,
      u.weekly_capacity_hours,
      u.availability_status,
      u.availability_notes,
      pm.role_id,
      r.role_key,
      r.name AS role_name
    FROM project_members pm
    JOIN users u ON pm.user_id = u.id
    LEFT JOIN roles r ON pm.role_id = r.id
    WHERE pm.project_id = ?
    ORDER BY u.name ASC
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

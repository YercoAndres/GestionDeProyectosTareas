const connection = require('../config/db');

const getAllRoles = (callback) => {
  const query = 'SELECT id AS id, role_key AS role_key, name AS name, description AS description FROM roles ORDER BY id ASC';
  connection.query(query, callback);
};

const getRoleByKey = (roleKey, callback) => {
  const query = 'SELECT TOP 1 id AS id, role_key AS role_key, name AS name FROM roles WHERE role_key = ?';
  connection.query(query, [roleKey], callback);
};

module.exports = {
  getAllRoles,
  getRoleByKey,
};


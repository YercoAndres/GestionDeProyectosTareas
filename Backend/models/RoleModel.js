const connection = require('../config/db');

const getAllRoles = (callback) => {
  const query = 'SELECT id, role_key, name, description FROM roles ORDER BY id ASC';
  connection.query(query, callback);
};

const getRoleByKey = (roleKey, callback) => {
  const query = 'SELECT id, role_key, name FROM roles WHERE role_key = ? LIMIT 1';
  connection.query(query, [roleKey], callback);
};

module.exports = {
  getAllRoles,
  getRoleByKey,
};


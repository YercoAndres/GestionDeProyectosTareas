const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (userData, callback) => {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [userData.name, userData.email, hashedPassword, userData.role], callback);
  },
  
  findByEmail: (email, callback) => {
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], callback);
  },
  
  getAllUsers: (callback) => {
    const query = 'SELECT * FROM users'; // Consulta para obtener todos los usuarios
    db.query(query, callback); // Ejecuta la consulta y llama al callback
  },

  // Nueva función para obtener un usuario por ID
  findById: (id, callback) => {
    const query = 'SELECT * FROM users WHERE id = ?';
    db.query(query, [id], callback);
  },
  updateUser: (id, userData, callback) => {
    const { name, email, password, role } = userData;
    const query = password
      ? 'UPDATE users SET name = ?, email = ?, password = ?, role = ? WHERE id = ?'
      : 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    const params = password
      ? [name, email, bcrypt.hashSync(password, 10), role, id]
      : [name, email, role, id];
    db.query(query, params, callback);
  }
};

module.exports = User;
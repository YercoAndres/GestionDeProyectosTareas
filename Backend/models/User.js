const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (userData, callback) => {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [userData.name, userData.email, hashedPassword, 'user'], callback);
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
  }
};

module.exports = User;
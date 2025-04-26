const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (userData, callback) => {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(query, [userData.name, userData.email, hashedPassword, userData.role], callback);
  },
  
  saveToken: (userId, token, callback) => {
    // Verifica la consulta SQL, asegurándonos de que se inserten correctamente los valores
    const query = 'INSERT INTO tokens (user_id, token, expiresAt) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))';
    db.query(query, [userId, token], (err, results) => {
        if (err) {
            console.error("Error al ejecutar la consulta de guardado de token:", err);
            return callback(err);
        } else {
            console.log("Token insertado correctamente en la BD:");
            return callback(null, results);
        }
    });
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
    const { name, email, role } = userData;
    const query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
    db.query(query, [name, email, role, id], callback);
  },
  updatePassword: (userId, hashedPassword, callback) => {
    const query = 'UPDATE users SET password = ? WHERE id = ?';
    db.query(query, [hashedPassword, userId], callback);
  }

};

module.exports = User;
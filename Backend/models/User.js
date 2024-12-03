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
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error en la consulta:', err);
        callback(err);
      } else {
        console.log('Resultados de la consulta:', results);  // Log de los resultados
        callback(null, results);  // Asegúrate de pasar los resultados correctamente
      }
    });
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
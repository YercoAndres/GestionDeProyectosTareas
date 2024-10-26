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
  }//,
  // deleteUser: (email, callback) => {
  //   const query = 'DELETE FROM users WHERE email =?';
  //   db.query(query, [email], callback)
  // }
};

module.exports = User;


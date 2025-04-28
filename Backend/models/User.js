const db = require("../config/db");
const bcrypt = require("bcryptjs");

// Objeto User que contiene métodos para interactuar con la base de datos

const User = {
  create: (userData, callback) => {
    const hashedPassword = bcrypt.hashSync(userData.password, 10);
    const query =
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(
      query,
      [userData.name, userData.email, hashedPassword, userData.role],
      callback
    );
  },
  findByEmail: (email, callback) => {
    const query = "SELECT * FROM users WHERE email = ?";
    db.query(query, [email], callback);
  },
  getAllUsers: (callback) => {
    const query = "SELECT * FROM users";
    db.query(query, callback);
  },
  findById: (id, callback) => {
    const query = "SELECT * FROM users WHERE id = ?";
    db.query(query, [id], callback);
  },
  updateUser: (id, userData, callback) => {
    const { name, email, role } = userData;
    const query = "UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?";
    db.query(query, [name, email, role, id], callback);
  },
  updatePassword: (userId, hashedPassword, callback) => {
    const query = "UPDATE users SET password = ? WHERE id = ?";
    db.query(query, [hashedPassword, userId], callback);
  },
  updateVerificationStatus: (userId, isVerified, callback) => {
    const query = "UPDATE users SET verify = ? WHERE id = ?";
    db.query(query, [isVerified, userId], callback);
  },
};

module.exports = User;

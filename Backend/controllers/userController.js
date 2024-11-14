// controllers/userController.js
const User = require('../models/User'); // Asegúrate de que el modelo de User esté importado

const getAllUsers = (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching users' });
    }
    res.json(users);
  });
};

module.exports = {
  getAllUsers,
};
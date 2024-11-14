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

// Nueva función para obtener un usuario por ID
const getUserById = (req, res) => {
  const userId = req.params.id; // Obtén el ID del usuario de los parámetros de la solicitud
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching user' });
    }
    if (!user.length) {
      return res.status(404).json({ error: 'User  not found' });
    }
    res.json(user[0]); // Devuelve el primer usuario encontrado
  });
};

module.exports = {
  getAllUsers,
  getUserById, // Asegúrate de exportar esta función
};
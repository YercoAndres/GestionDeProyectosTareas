// routes/userRoutes.js
const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserCapacity,
  getUserProjects,
} = require('../controllers/userController'); // Importa el controlador
const router = express.Router();
const { changePassword } = require('../controllers/authController');
const { authorizeRole } = require('../middlewares/authMiddleware');

router.get('/', getAllUsers); // Ruta para obtener todos los usuarios
router.get('/:id', getUserById); // Ruta para obtener un usuario por ID
router.put('/:id', updateUser); // Ruta para actualizar un usuario por ID
router.patch(
  '/:id/capacity',
  authorizeRole(['manager', 'user']),
  updateUserCapacity
);
router.get('/:id/projects', getUserProjects); // Ruta para obtener los proyectos de un usuario por ID
router.post('/:userId/change-password', changePassword);

module.exports = router;

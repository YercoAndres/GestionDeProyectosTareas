// routes/userRoutes.js
const express = require('express');
const { getAllUsers, getUserById, updateUser, getUserProjects } = require('../controllers/userController'); // Importa el controlador
const router = express.Router();

router.get('/', getAllUsers); // Ruta para obtener todos los usuarios
router.get('/:id', getUserById); // Ruta para obtener un usuario por ID
router.put('/:id', updateUser); // Ruta para actualizar un usuario por ID
router.get('/:id/projects', getUserProjects); // Ruta para obtener los proyectos de un usuario por ID

module.exports = router;
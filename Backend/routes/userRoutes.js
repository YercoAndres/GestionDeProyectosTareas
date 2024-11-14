// routes/userRoutes.js
const express = require('express');
const { getAllUsers, getUserById } = require('../controllers/userController'); // Importa el controlador
const router = express.Router();

router.get('/', getAllUsers); // Ruta para obtener todos los usuarios
router.get('/:id', getUserById); // Ruta para obtener un usuario por ID

module.exports = router;
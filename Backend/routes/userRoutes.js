// routes/userRoutes.js
const express = require('express');
const { getAllUsers } = require('../controllers/userController'); // Importa el controlador
const router = express.Router();

router.get('/', getAllUsers); // Ruta para obtener todos los usuarios

module.exports = router;
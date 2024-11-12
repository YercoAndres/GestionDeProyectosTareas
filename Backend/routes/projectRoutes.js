// src/routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject); // Asegúrate de que esta ruta esté configurada
router.delete('/:id', projectController.deleteProject); // Asegúrate de que esta ruta esté configurada

module.exports = router;

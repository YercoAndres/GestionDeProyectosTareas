const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController'); // Asegúrate de que esta ruta sea correcta
const { authorizeRole } = require('../middlewares/authMiddleware'); // Asegúrate de importar el middleware

// Obtener todos los proyectos (acceso para manager y user)
router.get('/', projectController.getAllProjects);

// Crear un nuevo proyecto (solo para managers)
router.post('/', authorizeRole(['manager']), projectController.createProject);

// Actualizar un proyecto (solo para managers)
router.put('/:id', authorizeRole(['manager']), projectController.updateProject);

// Eliminar un proyecto (solo para managers)
router.delete('/:id', authorizeRole(['manager']), projectController.deleteProject);

// Obtener miembros del proyecto
router.get('/:projectId/members', projectController.getProjectMembers);

module.exports = router;
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController'); 
const milestoneController = require('../controllers/milestoneController');
const dependencyController = require('../controllers/dependencyController');
const { authorizeRole } = require('../middlewares/authMiddleware'); 
const { validateProjectPayload } = require('../middlewares/validators');

// Obtener todos los proyectos (acceso para manager y user)
router.get('/', projectController.getAllProjects);

// Crear un nuevo proyecto (solo para managers)
router.post('/', authorizeRole(['manager']), validateProjectPayload, projectController.createProject);

// Actualizar un proyecto (solo para managers)
router.put('/:id', authorizeRole(['manager']), validateProjectPayload, projectController.updateProject);

// Eliminar un proyecto (solo para managers)
router.delete('/:id', authorizeRole(['manager']), projectController.deleteProject);

// Obtener sugerencias de asignación (solo para managers)
router.get(
  '/:projectId/assignment-suggestions',
  authorizeRole(['manager']),
  projectController.getAssignmentSuggestions
);

// Obtener miembros del proyecto
router.get('/:projectId/members', authorizeRole(['manager', 'user']), projectController.getProjectMembers);

// Hitos del proyecto
router.get(
  '/:projectId/milestones',
  authorizeRole(['manager', 'user']),
  milestoneController.getMilestones
);
router.post(
  '/:projectId/milestones',
  authorizeRole(['manager']),
  milestoneController.createMilestone
);
router.put(
  '/:projectId/milestones/:milestoneId',
  authorizeRole(['manager']),
  milestoneController.updateMilestone
);
router.delete(
  '/:projectId/milestones/:milestoneId',
  authorizeRole(['manager']),
  milestoneController.deleteMilestone
);

// Dependencias del proyecto
router.get(
  '/:projectId/dependencies',
  authorizeRole(['manager', 'user']),
  dependencyController.getDependencies
);
router.post(
  '/:projectId/dependencies',
  authorizeRole(['manager']),
  dependencyController.createDependency
);
router.delete(
  '/:projectId/dependencies/:dependencyId',
  authorizeRole(['manager']),
  dependencyController.deleteDependency
);
router.get(
  '/:projectId/critical-path',
  authorizeRole(['manager', 'user']),
  dependencyController.getCriticalPath
);

module.exports = router;


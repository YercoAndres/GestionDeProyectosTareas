const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController'); // Asegúrate de que esta ruta sea correcta

router.get('/', projectController.getAllProjects);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject); // Verifica que updateProject esté definido
router.delete('/:id', projectController.deleteProject);
module.exports = router;

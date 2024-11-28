const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Define la ruta para agregar una tarea a un proyecto
router.post('/:projectId/tasks', taskController.createTask);
router.get('/:projectId/tasks', taskController.getTasksByProjectId);
router.get('/', taskController.getAllTasks);
router.put('/:taskId', taskController.updateTask); // Ensure this route exists
router.delete('/:taskId', taskController.deleteTask);

module.exports = router;
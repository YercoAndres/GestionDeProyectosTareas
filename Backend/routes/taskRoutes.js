// taskRoutes.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Define la ruta para agregar una tarea a un proyecto
router.post('/projects/:projectId/tasks', taskController.createTask);

module.exports = router;

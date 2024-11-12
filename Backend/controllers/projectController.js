// src/controllers/projectController.js
const Project = require('../models/ProjectModel');
const Task = require('../models/TaskModel');

const getAllProjects = (req, res) => {
  Project.getAllProjects((err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

const createProject = (req, res) => {
  const newProject = req.body;
  Project.createProject(newProject, (err, results) => {
    if (err) {
      console.error('Error creating project:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, ...newProject });
  });
};

const updateProject = (req, res) => {
  const { id } = req.params;
  const updatedProject = req.body;
  Project.updateProject(id, updatedProject, (err, results) => {
    if (err) {
      console.error('Error updating project:', err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ id, ...updatedProject });
  });
};

const deleteProject = (req, res) => {
  const { id } = req.params;
  // Primero eliminamos las tareas asociadas al proyecto
  Task.deleteTasksByProjectId(id, (err) => {
    if (err) {
      console.error('Error deleting tasks:', err);
      return res.status(500).json({ error: err.message });
    }
    // Luego eliminamos el proyecto
    Project.deleteProject(id, (err, results) => {
      if (err) {
        console.error('Error deleting project:', err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ id });
    });
  });
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
};

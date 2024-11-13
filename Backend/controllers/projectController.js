
const connection = require('../config/db');
const Project = require('../models/ProjectModel');
const Task = require('../models/TaskModel');

const getAllProjects = (req, res) => {
  const query = 'SELECT * FROM projects';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching projects:', err);
      return res.status(500).json({ error: err.message });
    }
    
    // Aseg úrate de convertir los miembros de JSON a un array si es necesario
    const projectsWithMembers = results.map(project => ({
      ...project,
      members: project.members ? JSON.parse(project.members) : []
    }));

    res.json(projectsWithMembers);
  });
};

const createProject = (req, res) => {
  const { name, description, startDate, endDate, members } = req.body;

  // Verifica que los campos obligatorios no estén vacíos
  if (!name || !startDate || !endDate) {
    return res.status(400).json({ error: 'Por favor, completa todos los campos obligatorios.' });
  }

  const query = 'INSERT INTO projects (name, description, start_date, end_date, members) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [name, description, start_Date, end_Date, JSON.stringify(members)], (err, result) => {
    if (err) {
      console.error('Error al insertar el proyecto:', err);
      return res.status(500).json({ error: 'Error al crear el proyecto' });
    }

    return res.status(201).json({ message: 'Proyecto creado con éxito', projectId: result.insertId });
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

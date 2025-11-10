const Milestone = require('../models/MilestoneModel');

const getMilestones = (req, res) => {
  const { projectId } = req.params;
  Milestone.getMilestonesByProject(projectId, (err, rows) => {
    if (err) {
      console.error('Error al obtener hitos:', err);
      return res
        .status(500)
        .json({ message: 'Error al obtener los hitos del proyecto' });
    }
    res.json(rows || []);
  });
};

const createMilestone = (req, res) => {
  const { projectId } = req.params;
  const { name, description, startDate, dueDate, status } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'El nombre del hito es obligatorio' });
  }

  Milestone.createMilestone(
    {
      projectId,
      name: name.trim(),
      description: description || '',
      startDate: startDate || null,
      dueDate: dueDate || null,
      status: status || 'planned',
    },
    (err, result) => {
      if (err) {
        console.error('Error al crear hito:', err);
        return res
          .status(500)
          .json({ message: 'Error al crear el hito del proyecto' });
      }
      res.status(201).json({
        id: result.insertId,
        message: 'Hito creado correctamente',
      });
    }
  );
};

const updateMilestone = (req, res) => {
  const { milestoneId } = req.params;
  const { name, description, startDate, dueDate, status } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ message: 'El nombre del hito es obligatorio' });
  }

  Milestone.updateMilestone(
    milestoneId,
    {
      name: name.trim(),
      description: description || '',
      startDate: startDate || null,
      dueDate: dueDate || null,
      status: status || 'planned',
    },
    (err, result) => {
      if (err) {
        console.error('Error al actualizar hito:', err);
        return res
          .status(500)
          .json({ message: 'Error al actualizar el hito' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Hito no encontrado' });
      }
      res.json({ message: 'Hito actualizado correctamente' });
    }
  );
};

const deleteMilestone = (req, res) => {
  const { milestoneId } = req.params;
  Milestone.deleteMilestone(milestoneId, (err, result) => {
    if (err) {
      console.error('Error al eliminar hito:', err);
      return res
        .status(500)
        .json({ message: 'Error al eliminar el hito del proyecto' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Hito no encontrado' });
    }
    res.json({ message: 'Hito eliminado correctamente' });
  });
};

module.exports = {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};


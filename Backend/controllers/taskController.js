
const Task = require('../models/TaskModel');

const createTask = (req, res) => {
  const { projectId } = req.params;
  const newTask = { projectId, taskDescription: req.body.task };
  Task.createTask(newTask, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ id: results.insertId, ...newTask });
  });
};

module.exports = {
  createTask,
};

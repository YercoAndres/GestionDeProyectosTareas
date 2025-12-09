const connection = require('../config/db');

// Función para crear una tarea
const createTask = (task, callback) => {
  const {
    projectId,
    name,
    description,
    start_date,
    end_date,
    estimated_hours = null,
    story_points = null,
    priority,
    estado,
    responsable_id,
  } = task;
  connection.query(
    'INSERT INTO tasks (project_id, name, description, start_date, end_date, estimated_hours, story_points, priority, estado, Assigned_User_Id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [projectId, name, description, start_date, end_date, estimated_hours, story_points, priority, estado, responsable_id], 
    callback
  );
};

// Función para obtener las tareas de un proyecto
const getTasksByProjectId = (projectId, callback) => {
  const query = `
    SELECT
      id AS id,
      project_id AS project_id,
      name AS name,
      description AS description,
      start_date AS start_date,
      end_date AS end_date,
      estimated_hours AS estimated_hours,
      story_points AS story_points,
      priority AS priority,
      estado AS estado,
      Assigned_User_Id AS responsable_id
    FROM tasks
    WHERE project_id = ?
  `;
  connection.query(query, [projectId], callback);
};

// Función para obtener todas las tareas
const getAllTasks = (callback) => {
  const query = `
    SELECT
      id AS id,
      project_id AS project_id,
      name AS name,
      description AS description,
      start_date AS start_date,
      end_date AS end_date,
      estimated_hours AS estimated_hours,
      story_points AS story_points,
      priority AS priority,
      estado AS estado,
      Assigned_User_Id AS responsable_id
    FROM tasks
  `;
  connection.query(query, callback);
};

// Función para eliminar las tareas de un proyecto
const deleteTasksByProjectId = (projectId, callback) => {
  connection.query('DELETE FROM tasks WHERE project_id = ?', [projectId], callback);
};

const deleteTask = (taskId, callback) => {
  connection.query('DELETE FROM tasks WHERE id = ?', [taskId], callback);
};

const updateTask = (taskId, task, callback) => {
  const {
    name,
    description,
    start_date,
    end_date,
    estimated_hours = null,
    story_points = null,
    priority,
    estado,
    responsable_id,
  } = task;
  connection.query(
    'UPDATE tasks SET name = ?, description = ?, start_date = ?, end_date = ?, estimated_hours = ?, story_points = ?, priority = ?, estado = ?, Assigned_User_Id = ? WHERE id = ?',
    [name, description, start_date, end_date, estimated_hours, story_points, priority, estado, responsable_id, taskId],
    callback
  );
};

module.exports = {
  createTask,
  getTasksByProjectId,
  getAllTasks,
  deleteTasksByProjectId,
  deleteTask,
  updateTask,
};

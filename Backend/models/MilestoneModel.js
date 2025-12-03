const connection = require('../config/db');

const getMilestonesByProject = (projectId, callback) => {
  const query = `
    SELECT
      id AS id,
      project_id AS project_id,
      name AS name,
      description AS description,
      start_date AS start_date,
      due_date AS due_date,
      status AS status,
      created_at AS created_at,
      updated_at AS updated_at
    FROM milestones
    WHERE project_id = ?
    ORDER BY
      CASE WHEN due_date IS NULL THEN 1 ELSE 0 END,
      due_date ASC,
      id ASC
  `;
  connection.query(query, [projectId], callback);
};

const createMilestone = (milestone, callback) => {
  const {
    projectId,
    name,
    description = '',
    startDate = null,
    dueDate = null,
    status = 'planned',
  } = milestone;
  const query = `
    INSERT INTO milestones (project_id, name, description, start_date, due_date, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  connection.query(
    query,
    [projectId, name, description, startDate, dueDate, status],
    callback
  );
};

const updateMilestone = (milestoneId, milestone, callback) => {
  const {
    name,
    description = '',
    startDate = null,
    dueDate = null,
    status = 'planned',
  } = milestone;
  const query = `
    UPDATE milestones
    SET name = ?, description = ?, start_date = ?, due_date = ?, status = ?
    WHERE id = ?
  `;
  connection.query(
    query,
    [name, description, startDate, dueDate, status, milestoneId],
    callback
  );
};

const deleteMilestone = (milestoneId, callback) => {
  const query = 'DELETE FROM milestones WHERE id = ?';
  connection.query(query, [milestoneId], callback);
};

module.exports = {
  getMilestonesByProject,
  createMilestone,
  updateMilestone,
  deleteMilestone,
};


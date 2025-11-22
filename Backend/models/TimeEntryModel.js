const connection = require('../config/db');

const createTimeEntry = (entry, callback) => {
  const {
    taskId,
    projectId,
    userId,
    startedAt,
    endedAt = null,
    durationMinutes,
    note = '',
  } = entry;

  const query = `
    INSERT INTO time_entries
      (task_id, project_id, user_id, started_at, ended_at, duration_minutes, note)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    query,
    [taskId, projectId, userId, startedAt, endedAt, durationMinutes, note],
    callback
  );
};

const getEntriesByTask = (taskId, callback) => {
  connection.query(
    'SELECT * FROM time_entries WHERE task_id = ? ORDER BY started_at DESC',
    [taskId],
    callback
  );
};

const getEntriesByProject = (projectId, callback) => {
  connection.query(
    'SELECT * FROM time_entries WHERE project_id = ? ORDER BY started_at DESC',
    [projectId],
    callback
  );
};

const getSummaryByProject = (projectId, callback) => {
  const query = `
    SELECT
      COALESCE(SUM(duration_minutes), 0) AS total_minutes,
      COUNT(*) AS entry_count
    FROM time_entries
    WHERE project_id = ?
  `;
  connection.query(query, [projectId], callback);
};

const getSummaryByProjectGrouped = (projectId, callback) => {
  const query = `
    SELECT
      user_id,
      COALESCE(SUM(duration_minutes), 0) AS total_minutes
    FROM time_entries
    WHERE project_id = ?
    GROUP BY user_id
  `;
  connection.query(query, [projectId], callback);
};

module.exports = {
  createTimeEntry,
  getEntriesByTask,
  getEntriesByProject,
  getSummaryByProject,
  getSummaryByProjectGrouped,
};


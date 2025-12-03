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
  const query = `
    SELECT
      id AS id,
      task_id AS task_id,
      project_id AS project_id,
      user_id AS user_id,
      started_at AS started_at,
      ended_at AS ended_at,
      duration_minutes AS duration_minutes,
      note AS note,
      created_at AS created_at,
      updated_at AS updated_at
    FROM time_entries
    WHERE task_id = ?
    ORDER BY started_at DESC
  `;
  connection.query(query, [taskId], callback);
};

const getEntriesByProject = (projectId, callback) => {
  const query = `
    SELECT
      id AS id,
      task_id AS task_id,
      project_id AS project_id,
      user_id AS user_id,
      started_at AS started_at,
      ended_at AS ended_at,
      duration_minutes AS duration_minutes,
      note AS note,
      created_at AS created_at,
      updated_at AS updated_at
    FROM time_entries
    WHERE project_id = ?
    ORDER BY started_at DESC
  `;
  connection.query(query, [projectId], callback);
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


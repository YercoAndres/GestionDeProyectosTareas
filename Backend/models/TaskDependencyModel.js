const connection = require('../config/db');

const getDependenciesByProject = (projectId, callback) => {
  const query = `
    SELECT
      d.id AS id,
      d.task_id AS task_id,
      d.depends_on_task_id AS depends_on_task_id,
      d.dependency_type AS dependency_type,
      d.note AS note,
      t.name AS task_name,
      t.estimated_hours AS task_estimated_hours,
      dt.name AS depends_on_name,
      dt.estimated_hours AS depends_on_estimated_hours
    FROM task_dependencies d
    INNER JOIN tasks t ON d.task_id = t.id
    INNER JOIN tasks dt ON d.depends_on_task_id = dt.id
    WHERE t.project_id = ? AND dt.project_id = ?
    ORDER BY t.name ASC, dt.name ASC
  `;
  connection.query(query, [projectId, projectId], callback);
};

const createDependency = (dependency, callback) => {
  const { taskId, dependsOnTaskId, dependencyType = 'FS', note = '' } =
    dependency;
  const query = `
    INSERT INTO task_dependencies (task_id, depends_on_task_id, dependency_type, note)
    VALUES (?, ?, ?, ?)
  `;
  connection.query(
    query,
    [taskId, dependsOnTaskId, dependencyType, note],
    callback
  );
};

const deleteDependency = (dependencyId, callback) => {
  const query = 'DELETE FROM task_dependencies WHERE id = ?';
  connection.query(query, [dependencyId], callback);
};

const getDependencyGraph = (projectId, callback) => {
  const query = `
    SELECT
      t.id AS id,
      t.name AS name,
      t.estimated_hours AS estimated_hours,
      t.start_date AS start_date,
      t.end_date AS end_date,
      d.depends_on_task_id AS depends_on_task_id,
      d.dependency_type AS dependency_type
    FROM tasks t
    LEFT JOIN task_dependencies d ON d.task_id = t.id
    WHERE t.project_id = ?
  `;
  connection.query(query, [projectId], callback);
};

module.exports = {
  getDependenciesByProject,
  createDependency,
  deleteDependency,
  getDependencyGraph,
};

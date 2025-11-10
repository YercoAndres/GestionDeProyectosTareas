-- Fase 3: Hitos y dependencias de tareas

CREATE TABLE IF NOT EXISTS milestones (
  id INT NOT NULL AUTO_INCREMENT,
  project_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE DEFAULT NULL,
  due_date DATE DEFAULT NULL,
  status ENUM('planned','in_progress','completed','delayed') DEFAULT 'planned',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_milestones_project (project_id),
  KEY idx_milestones_status (status),
  CONSTRAINT fk_milestones_project FOREIGN KEY (project_id)
    REFERENCES projects (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS task_dependencies (
  id INT NOT NULL AUTO_INCREMENT,
  task_id INT NOT NULL,
  depends_on_task_id INT NOT NULL,
  dependency_type ENUM('FS','FF','SS','SF') DEFAULT 'FS',
  note VARCHAR(255) DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_task_dependencies (task_id, depends_on_task_id),
  KEY idx_task_dependencies_task (task_id),
  KEY idx_task_dependencies_depends_on (depends_on_task_id),
  CONSTRAINT fk_task_dependencies_task FOREIGN KEY (task_id)
    REFERENCES tasks (id) ON DELETE CASCADE,
  CONSTRAINT fk_task_dependencies_depends_on FOREIGN KEY (depends_on_task_id)
    REFERENCES tasks (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Fase 1: Métricas básicas y control de tiempo
-- Agrega campos de estimaciones a las tareas y una tabla para registrar tiempos.

ALTER TABLE tasks
  ADD COLUMN estimated_hours DECIMAL(10,2) NULL AFTER end_date,
  ADD COLUMN story_points INT NULL AFTER estimated_hours;

CREATE TABLE IF NOT EXISTS time_entries (
  id INT NOT NULL AUTO_INCREMENT,
  task_id INT NOT NULL,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  started_at DATETIME NOT NULL,
  ended_at DATETIME DEFAULT NULL,
  duration_minutes INT NOT NULL,
  note VARCHAR(255) DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_time_entries_task (task_id),
  KEY idx_time_entries_project (project_id),
  KEY idx_time_entries_user (user_id),
  CONSTRAINT fk_time_entries_task FOREIGN KEY (task_id) REFERENCES tasks (id),
  CONSTRAINT fk_time_entries_project FOREIGN KEY (project_id) REFERENCES projects (id),
  CONSTRAINT fk_time_entries_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


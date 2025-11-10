-- Fase 2: Gestión avanzada de miembros

ALTER TABLE users
  ADD COLUMN weekly_capacity_hours DECIMAL(5,2) NOT NULL DEFAULT 40 AFTER role,
  ADD COLUMN availability_status ENUM('available','limited','unavailable') NOT NULL DEFAULT 'available' AFTER weekly_capacity_hours,
  ADD COLUMN availability_notes VARCHAR(255) DEFAULT NULL AFTER availability_status;

CREATE TABLE IF NOT EXISTS roles (
  id INT NOT NULL AUTO_INCREMENT,
  role_key VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description VARCHAR(255) DEFAULT '',
  permissions JSON DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_roles_role_key (role_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE project_members
  ADD COLUMN role_id INT DEFAULT NULL,
  ADD KEY idx_project_members_role (role_id),
  ADD CONSTRAINT fk_project_members_role FOREIGN KEY (role_id) REFERENCES roles (id);

INSERT INTO roles (role_key, name, description)
VALUES 
  ('viewer', 'Observador', 'Puede visualizar proyectos y tareas.'),
  ('collaborator', 'Colaborador', 'Puede crear y actualizar tareas asignadas.'),
  ('admin', 'Administrador de proyecto', 'Puede gestionar miembros, tareas y ajustes del proyecto.')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  description = VALUES(description);

UPDATE project_members
SET role_id = (SELECT id FROM roles WHERE role_key = 'collaborator' LIMIT 1)
WHERE role_id IS NULL;


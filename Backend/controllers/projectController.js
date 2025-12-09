const connection = require("../config/db");
const Project = require("../models/ProjectModel");
const Role = require("../models/RoleModel");
const { transporter } = require("../config/nodemailer"); // Importar el transporter de nodemailer

const normalizeMemberPayload = (members = []) =>
  members
    .map((member) => {
      if (member && typeof member === "object") {
        const userId = Number(
          member.userId ?? member.id ?? member.user_id ?? member.memberId
        );
        const roleId =
          member.roleId ?? member.role_id ?? member.roleId ?? null;
        if (!Number.isNaN(userId) && userId > 0) {
          return {
            userId,
            roleId: roleId ? Number(roleId) : null,
          };
        }
        return null;
      }
      const numericId = Number(member);
      if (Number.isNaN(numericId) || numericId <= 0) {
        return null;
      }
      return { userId: numericId, roleId: null };
    })
    .filter(Boolean);

// Obtener todos los proyectos con miembros
const getAllProjects = (req, res) => {
  const query = `
      SELECT 
        p.id AS id,
        p.name AS name,
        p.description AS description,
        p.start_date AS start_date,
        p.end_date AS end_date,
        p.status AS status,
        pm.user_id AS member_id,
        pm.role_id AS member_role_id,
        u.name AS member_name,
        u.weekly_capacity_hours AS weekly_capacity_hours,
        r.role_key AS role_key,
        r.name AS role_name
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN users u ON pm.user_id = u.id
      LEFT JOIN roles r ON pm.role_id = r.id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ error: err.message });
    }

    const projectsWithMembers = results.reduce((acc, project) => {
      const {
        id,
        name,
        description,
        start_date,
        end_date,
        status,
        member_id,
        member_name,
        member_role_id,
        role_key,
        role_name,
      } = project;
      const existingProject = acc.find((p) => p.id === id);
      if (existingProject) {
        if (member_name && !existingProject.members.includes(member_name)) {
          existingProject.members.push(member_name);
        }
        if (
          member_id &&
          !existingProject.memberIds.includes(Number(member_id))
        ) {
          existingProject.memberIds.push(Number(member_id));
        }
        if (member_id) {
          const exists = existingProject.memberAssignments.find(
            (assignment) => assignment.userId === Number(member_id)
          );
          if (!exists) {
            existingProject.memberAssignments.push({
              userId: Number(member_id),
              roleId: member_role_id ? Number(member_role_id) : null,
              roleKey: role_key || null,
              roleName: role_name || null,
              name: member_name || null,
            });
          }
        }
      } else {
        acc.push({
          id,
          name,
          description,
          start_date,
          end_date,
          status,
          startDate: start_date,
          endDate: end_date,
          members: member_name ? [member_name] : [],
          memberIds: member_id ? [Number(member_id)] : [],
          memberAssignments: member_id
            ? [
                {
                  userId: Number(member_id),
                  roleId: member_role_id ? Number(member_role_id) : null,
                  roleKey: role_key || null,
                  roleName: role_name || null,
                  name: member_name || null,
                },
              ]
            : [],
        });
      }
      return acc;
    }, []);

    res.json(projectsWithMembers);
  });
};

// Crear un nuevo proyecto

const createProject = (req, res) => {
  const { name, description, startDate, endDate, members, status } = req.body;
  const normalizedMembers = normalizeMemberPayload(members);

  Role.getRoleByKey("collaborator", (roleErr, roleRows) => {
    if (roleErr) {
      console.error("Error obteniendo el rol por defecto:", roleErr);
      return res
        .status(500)
        .json({ error: "Error al obtener el rol por defecto" });
    }
    const defaultRoleId = roleRows?.[0]?.id || null;

    const memberQueries = normalizedMembers.map(({ userId }) => {
      return new Promise((resolve, reject) => {
        const checkMemberQuery = "SELECT * FROM users WHERE id = ?";
        connection.query(checkMemberQuery, [userId], (userErr, results) => {
          if (userErr) return reject(userErr);
          if (!results || results.length === 0) {
            return reject(new Error(`Miembro con ID ${userId} no existe`));
          }
          resolve(results[0]); // Retornar el usuario encontrado
        });
      });
    });

    Promise.all(memberQueries)
      .then((users) => {
        const projectData = {
          name,
          description: description || "",
          start_date: startDate,
          end_date: endDate,
          status: status || "En progreso",
        };
        const insertProjectQuery =
          "INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)";
        connection.query(
          insertProjectQuery,
          [
            projectData.name,
            projectData.description,
            projectData.start_date,
            projectData.end_date,
            projectData.status,
          ],
          (insertErr, result) => {
            if (insertErr) {
              console.error("Error al insertar el proyecto:", insertErr);
              return res
                .status(500)
                .json({ error: "Error al crear el proyecto" });
            }
            const projectId = result.insertId;

            const memberInsertPromises = normalizedMembers.map(
              ({ userId, roleId }) => {
                const memberRoleId =
                  roleId && Number(roleId) > 0 ? Number(roleId) : defaultRoleId;
                const memberQuery = `
                  INSERT INTO project_members (project_id, user_id, role_id)
                  VALUES (?, ?, ?)
                `;
                return new Promise((resolve, reject) => {
                  connection.query(
                    memberQuery,
                    [projectId, userId, memberRoleId],
                    (memberErr) => {
                      if (memberErr) return reject(memberErr);
                      resolve();
                    }
                  );
                });
              }
            );

            Promise.all(memberInsertPromises)
              .then(() => {
                users.forEach((userData) => {
                  const mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: userData.email,
                    subject: "Nuevo Proyecto Asignado",
                    html: `
                  <p>Hola ${userData.name},</p>
                  <p>Se ha creado un nuevo proyecto llamado <strong>${name}</strong> y has sido asignado como miembro del equipo.</p>
                  <p>Por favor, revisa la plataforma para más detalles.</p>
                `,
                  };

                  transporter.sendMail(mailOptions, (mailErr, info) => {
                    if (mailErr) {
                      console.error(
                        `Error al enviar correo a ${userData.email}:`,
                        mailErr
                      );
                    } else {
                      console.log(
                        `Correo enviado a ${userData.email}:`,
                        info.response
                      );
                    }
                  });
                });

                res
                  .status(201)
                  .json({ message: "Proyecto creado con éxito", projectId });
              })
              .catch((memberErr) => {
                console.error("Error al insertar miembros:", memberErr);
                res
                  .status(500)
                  .json({ error: "Error al agregar miembros al proyecto" });
              });
          }
        );
      })
      .catch((promiseErr) => {
        console.error(promiseErr);
        return res.status(400).json({ error: promiseErr.message });
      });
  });
};

const updateProject = (req, res) => {
  const { id } = req.params;
  const normalizedMembers = normalizeMemberPayload(req.body.members);

  Role.getRoleByKey("collaborator", (roleErr, roleRows) => {
    if (roleErr) {
      console.error("Error obteniendo rol por defecto:", roleErr);
      return res
        .status(500)
        .json({ error: "Error obteniendo rol por defecto" });
    }

    const defaultRoleId = roleRows?.[0]?.id || null;
    const projectData = {
      ...req.body,
      members: normalizedMembers.map(({ userId, roleId }) => ({
        userId,
        roleId: roleId && Number(roleId) > 0 ? Number(roleId) : defaultRoleId,
      })),
    };

    Project.updateProject(id, projectData, (err) => {
      if (err) {
        return res.status(500).json({ error: "Error updating project" });
      }
      res.json({ message: "Project updated successfully" });
    });
  });
};

const deleteProject = (req, res) => {
  const { id } = req.params; // Obtén el ID del proyecto de los parámetros

  Project.deleteProject(id, (err, result) => {
    if (err) {
      console.error("Error al eliminar el proyecto:", err);
      return res.status(500).json({ error: "Error al eliminar el proyecto" });
    }
    res.json({ message: "Proyecto eliminado con éxito" });
  });
};

const getProjectMembers = (req, res) => {
  const { projectId } = req.params;
  if (projectId === undefined || projectId === null || projectId === 'undefined') {
    return res.status(400).json({ message: 'projectId requerido' });
  }
  Project.getProjectMembers(projectId, (err, members) => {
    if (err) {
      console.error("Error al obtener los miembros del proyecto:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener los miembros del proyecto" });
    }
    const formattedMembers = (members || []).map((member) => ({
      id: member.id,
      name: member.name,
      email: member.email,
      weeklyCapacityHours: Number(member.weekly_capacity_hours || 0),
      activeAssignedHours: Number(member.active_assigned_hours || 0),
      availableHours: Math.max(
        0,
        Number(member.weekly_capacity_hours || 0) -
          Number(member.active_assigned_hours || 0)
      ),
      availabilityStatus: member.availability_status,
      availabilityNotes: member.availability_notes,
      roleId: member.role_id ? Number(member.role_id) : null,
      roleKey: member.role_key || null,
      roleName: member.role_name || null,
    }));
    res.json(formattedMembers);
  });
};

const getAssignmentSuggestions = (req, res) => {
  const { projectId } = req.params;
  if (!projectId || projectId === 'undefined') {
    return res.status(400).json({ message: 'projectId requerido' });
  }
  const query = `
    SELECT
      u.id,
      u.name,
      u.email,
      u.weekly_capacity_hours,
      u.availability_status,
      u.availability_notes,
      pm.role_id,
      r.role_key,
      r.name AS role_name,
      CASE WHEN pm.project_id IS NULL THEN 0 ELSE 1 END AS is_member,
      COALESCE(SUM(
        CASE 
          WHEN t.estado IS NULL OR LOWER(t.estado) <> 'completado' 
            THEN COALESCE(t.estimated_hours, 1)
          ELSE 0
        END
      ), 0) AS assigned_hours,
      COALESCE(SUM(
        CASE 
          WHEN t.estado IS NULL OR LOWER(t.estado) <> 'completado' 
            THEN 1
          ELSE 0
        END
      ), 0) AS active_tasks
    FROM users u
    LEFT JOIN project_members pm ON pm.user_id = u.id AND pm.project_id = ?
    LEFT JOIN roles r ON pm.role_id = r.id
    LEFT JOIN tasks t ON t.Assigned_User_Id = u.id
    GROUP BY
      u.id,
      u.name,
      u.email,
      u.weekly_capacity_hours,
      u.availability_status,
      u.availability_notes,
      pm.role_id,
      r.role_key,
      r.name,
      pm.project_id
  `;

  connection.query(query, [projectId], (err, rows) => {
    if (err) {
      console.error("Error al calcular sugerencias:", err);
      return res
        .status(500)
        .json({ message: "Error al calcular sugerencias de asignación" });
    }

    const suggestions = rows
      .map((row) => {
        const capacity = Number(row.weekly_capacity_hours || 0);
        const assignedHours = Number(row.assigned_hours || 0);
        const availableHours = Number((capacity - assignedHours).toFixed(2));
        return {
          userId: row.id,
          name: row.name,
          email: row.email,
          weeklyCapacityHours: capacity,
          assignedHours,
          availableHours,
          activeTasks: Number(row.active_tasks || 0),
          availabilityStatus: row.availability_status,
          availabilityNotes: row.availability_notes,
          roleId: row.role_id ? Number(row.role_id) : null,
          roleKey: row.role_key || null,
          roleName: row.role_name || null,
          isMember: Boolean(row.is_member),
        };
      })
      .sort((a, b) => {
        if (b.availableHours !== a.availableHours) {
          return b.availableHours - a.availableHours;
        }
        return a.assignedHours - b.assignedHours;
      });

    res.json(suggestions);
  });
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  getAssignmentSuggestions,
};

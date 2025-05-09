const connection = require("../config/db");
const Project = require("../models/ProjectModel");
const Task = require("../models/TaskModel");
const { transporter } = require("../config/nodemailer"); // Importar el transporter de nodemailer

// Obtener todos los proyectos con miembros
const getAllProjects = (req, res) => {
  const query = `
      SELECT p.*, u.name AS member_name
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN users u ON pm.user_id = u.id
  `;
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ error: err.message });
    }

    const projectsWithMembers = results.reduce((acc, project) => {
      const { id, name, description, start_date, end_date, member_name } =
        project;
      const existingProject = acc.find((p) => p.id === id);
      if (existingProject) {
        existingProject.members.push(member_name);
      } else {
        acc.push({
          id,
          name,
          description,
          start_date,
          end_date,
          members: member_name ? [member_name] : [],
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

  const memberQueries = members.map((memberId) => {
    return new Promise((resolve, reject) => {
      const checkMemberQuery = "SELECT * FROM users WHERE id = ?";
      connection.query(checkMemberQuery, [memberId], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0)
          return reject(new Error(`Miembro con ID ${memberId} no existe`));
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
        status: status || "En Progreso",
      };
      const query =
        "INSERT INTO projects (name, description, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)";
      connection.query(
        query,
        [
          projectData.name,
          projectData.description,
          projectData.start_date,
          projectData.end_date,
          projectData.status,
        ],
        (err, result) => {
          if (err) {
            console.error("Error al insertar el proyecto:", err);
            return res
              .status(500)
              .json({ error: "Error al crear el proyecto" });
          }
          const projectId = result.insertId;

          const memberQueries = members.map((memberId) => {
            return new Promise((resolve, reject) => {
              const memberQuery =
                "INSERT INTO project_members (project_id, user_id) VALUES (?, ?)";
              connection.query(memberQuery, [projectId, memberId], (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          });

          Promise.all(memberQueries)
            .then(() => {
              // Enviar correos a los miembros
              users.forEach((user) => {
                const mailOptions = {
                  from: process.env.EMAIL_USER,
                  to: user.email,
                  subject: "Nuevo Proyecto Asignado",
                  html: `
                  <p>Hola ${user.name},</p>
                  <p>Se ha creado un nuevo proyecto llamado <strong>${name}</strong> y has sido asignado como miembro del equipo.</p>
                  <p>Por favor, revisa la plataforma para más detalles.</p>
                `,
                };

                transporter.sendMail(mailOptions, (err, info) => {
                  if (err) {
                    console.error(
                      `Error al enviar correo a ${user.email}:`,
                      err
                    );
                  } else {
                    console.log(
                      `Correo enviado a ${user.email}:`,
                      info.response
                    );
                  }
                });
              });

              res
                .status(201)
                .json({ message: "Proyecto creado con éxito", projectId });
            })
            .catch((err) => {
              console.error("Error al insertar miembros:", err);
              res
                .status(500)
                .json({ error: "Error al agregar miembros al proyecto" });
            });
        }
      );
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({ error: err.message });
    });
};

const updateProject = (req, res) => {
  const { id } = req.params;
  const projectData = req.body; // Asegúrate de que los datos del proyecto estén en el cuerpo de la solicitud

  Project.updateProject(id, projectData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error updating project" });
    }
    res.json({ message: "Project updated successfully" });
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
  Project.getProjectMembers(projectId, (err, members) => {
    if (err) {
      console.error("Error al obtener los miembros del proyecto:", err);
      return res
        .status(500)
        .json({ message: "Error al obtener los miembros del proyecto" });
    }
    res.json(members);
  });
};

module.exports = {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectMembers,
};

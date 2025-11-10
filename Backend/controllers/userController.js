// controllers/userController.js
const User = require("../models/User"); // Asegúrate de que el modelo de User esté importado
const Project = require("../models/ProjectModel");

const getAllUsers = (req, res) => {
  User.getAllUsers((err, users) => {
    if (err) {
      console.error("Error fetching users:", err); // Log the error
      return res
        .status(500)
        .json({ error: "Error fetching users", details: err.message });
    }
    res.json(users);
  });
};

const getUserById = (req, res) => {
  const userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching user" });
    }
    if (!user.length) {
      return res.status(404).json({ error: "User  not found" });
    }
    res.json(user[0]);
  });
};

const updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, password, role } = req.body;

  const updateData = { name, email, role };
  if (password) {
    updateData.password = password;
  }

  User.updateUser(userId, updateData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Error updating user" });
    }
    res.json({ message: "User updated successfully" });
  });
};

const updateUserCapacity = (req, res) => {
  const userId = Number(req.params.id);
  const { weeklyCapacityHours, availabilityStatus, availabilityNotes } = req.body;
  const requester = req.user;

  if (!requester) {
    return res.status(403).json({ message: "No autorizado" });
  }

  const isSelfUpdate = requester.id === userId;
  const isManager = requester.role === "manager";

  if (!isSelfUpdate && !isManager) {
    return res
      .status(403)
      .json({ message: "No tienes permisos para actualizar este usuario" });
  }

  const capacityValue = Number(weeklyCapacityHours);
  if (Number.isNaN(capacityValue) || capacityValue < 0) {
    return res
      .status(400)
      .json({ message: "weeklyCapacityHours debe ser un número válido" });
  }

  const normalizedStatus = availabilityStatus || "available";

  User.updateCapacity(
    userId,
    {
      weeklyCapacityHours: capacityValue,
      availabilityStatus: normalizedStatus,
      availabilityNotes: availabilityNotes || null,
    },
    (err) => {
      if (err) {
        console.error("Error al actualizar la capacidad:", err);
        return res
          .status(500)
          .json({ message: "Error al actualizar la capacidad del usuario" });
      }
      res.json({ message: "Capacidad actualizada correctamente" });
    }
  );
};

const getUserProjects = (req, res) => {
  const userId = req.params.id;
  Project.getProjectsByUserId(userId, (err, projects) => {
    if (err) {
      return res.status(500).json({ error: "Error fetching projects" });
    }
    res.json(projects);
  });
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  updateUserCapacity,
  getUserProjects,
};

const Role = require('../models/RoleModel');

const getRoles = (_req, res) => {
  Role.getAllRoles((err, roles) => {
    if (err) {
      console.error('Error al obtener los roles:', err);
      return res.status(500).json({ message: 'Error al obtener los roles' });
    }
    res.json(roles || []);
  });
};

module.exports = {
  getRoles,
};


// src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ message: 'Error interno del servidor' });
};

module.exports = errorHandler;

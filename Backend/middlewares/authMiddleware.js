const jwt = require('jsonwebtoken');

const authorizeRole = (roles) => {
  return (req, res, next) => {
    const authHeader = req.headers['authorization'] || '';
    const [scheme, token] = authHeader.split(' ');

    if (!scheme || scheme.toLowerCase() !== 'bearer' || !token) {
      return res.status(403).json({ message: 'Token ausente o formato invalido' });
    }

    const allowedAlgs = ['HS256'];

    jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: allowedAlgs },
      (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Token invalido o expirado' });
        }

        if (!decoded || !decoded.role) {
          return res.status(403).json({ message: 'Token sin rol' });
        }

        if (!roles.includes(decoded.role)) {
          return res.status(403).json({ message: 'Acceso denegado' });
        }

        req.user = decoded;
        next();
      }
    );
  };
};

module.exports = { authorizeRole };

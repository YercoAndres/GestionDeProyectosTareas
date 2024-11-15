const jwt = require('jsonwebtoken');

const authorizeRole = (roles) => {
    return (req, res, next) => {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: 'No se proporcionó token' });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Token inválido' });
            }

            // Verificar que el rol del usuario esté permitido
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }

            req.user = decoded; // Guardar la información del usuario en el request
            next();
        });
    };
};

module.exports = { authorizeRole };

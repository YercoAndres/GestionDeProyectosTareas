const user = require ('../models/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AuthEmail = require('../emails/AuthEmail');
const generateToken = require('../utils/token'); // Importa la función correctamente



const register = (req, res) => {
  const { name, email, password, role } = req.body;

  user.findByEmail(email, (err, results) => {
      if (err) return res.status(500).json({ message: 'Error en la base de datos' });
      if (results.length > 0) return res.status(400).json({ message: 'Usuario ya existe' });

      // Crear usuario
      user.create({ name, email, password, role }, (err, result) => {
          if (err) return res.status(500).json({ message: 'Error al registrar usuario' });

          const userId = result.insertId; // Obtener el ID del usuario recién creado
          console.log(userId)
          const token = generateToken(); // Generar el token de verificación
          
          // Guardar el token en la base de datos
          user.saveToken(userId, token, (err) => {
              if (err) return res.status(500).json({ message: 'Error al guardar el token' });

              // Enviar correo de confirmación
              AuthEmail({ email, name, token });

              return res.status(201).json({ message: 'Usuario registrado exitosamente. Verifica tu email.' });
          });
      });
  });
}


const login = (req, res) => {
    const { email, password } = req.body;
  
    user.findByEmail(email, (err, results) => {
      if (results.length === 0) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
      const user = results[0];
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }
  
      const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
      });
      return res.status(200).json({ token, user }); 
    });
  };


  const changePassword = async (req, res) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
  
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: 'No se proporcionó token de autenticación' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).json({ message: 'Token inválido' });
        }
      });
  
      user.findById(userId, (err, results) => {
        if (err || results.length === 0) {
          return res.status(400).json({ message: 'Usuario no encontrado' });
        }
  
        const userFound = results[0];
        const isMatch = bcrypt.compareSync(currentPassword, userFound.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Contraseña actual incorrecta' });
        }
  
        const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
        user.updatePassword(userId, hashedNewPassword, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Error al cambiar la contraseña' });
          }
          res.status(200).json({ message: 'Contraseña cambiada correctamente' });
        });
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  };

module.exports = {register, login, changePassword};

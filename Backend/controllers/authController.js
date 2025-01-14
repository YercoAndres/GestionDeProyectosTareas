const user = require ('../models/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendEmail } = require('./mailController'); 

const register = (req, res) => {
    const { name, email, password, role } = req.body; // extraiga los datos del cuerpo de la solicitud 
    // verificamos si el correo existe
    user.findByEmail(email, (err, results)=>{
        if (results.length > 0) {
            return res.status(400).json({message: 'Usuario ya existe'})
        } else {
            user.create({ name, email, password, role}, (err, res)=>{
                if(err) throw err;
                sendEmail(req, res);
                return res.status(201).json ({message: 'Usuario registrado de forma exitosa'})               
            });
        }
    });
};
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
        expiresIn: '8h'
      });
      return res.status(200).json({ token, user }); // Asegúrate de devolver el objeto user
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

const user = require ('../models/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');

const user = require ('../models/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
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

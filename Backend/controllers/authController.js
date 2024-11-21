const user = require ('../models/User');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = (req, res) => {
    const { name, email, password, role } = req.body; // extraiga los datos del cuerpo de la solicitud 
    // verificamos si el correo existe
    user.findByEmail(email, (err, results)=>{
        if (results.length > 0) {
            return res.status(400).json({message: 'Usuario ya existe'})
        } else {
            user.create({ name, email, password, role}, (err, results)=>{
                if(err) throw err;
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
        expiresIn: '1h'
      });
      return res.status(200).json({ token, user }); // Asegúrate de devolver el objeto user
    });
  };


module.exports = {register, login};

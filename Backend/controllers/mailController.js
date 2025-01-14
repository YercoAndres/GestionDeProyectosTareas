const nodemailer = require('nodemailer');

require('dotenv').config();



    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
        }
    })

  

exports.sendEmail = (req, res) =>{
    const email = req.body.email;  // Definir la variable email
   

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verificación de cuenta',
      text: `Hola! Usa este enlace para verificar tu cuenta: http://localhost:5000/api/auth/verify/ACA DEBERIA IR EL ENLACE`,
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al enviar el correo' });
      }
      res.status(200).json({ message: 'Correo enviado correctamente', info });
    });
}
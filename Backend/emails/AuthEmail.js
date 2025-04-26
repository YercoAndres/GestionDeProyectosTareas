const { transporter } = require("../config/nodemailer");

const AuthEmail = async (user) => {
    try {
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'ProjectTask - Confirma tu cuenta',
            html: `
                <p>Hola ${user.name},</p>    
                <p>Gracias por registrarte en nuestra aplicacion, ahora solo debes confirmar tu cuenta, para poder utilizarla.</p>          
                <p>Ingresa el siguiente código en la aplicación: <strong>${user.token}</strong></p>
                <p>Este código expira en 10 minutos.</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        return { success: true, message: 'Correo enviado correctamente' };
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return { success: false, message: 'Error al enviar el correo', error };
    }
};

module.exports = AuthEmail;


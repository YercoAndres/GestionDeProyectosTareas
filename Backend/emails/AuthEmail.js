const { transporter } = require("../config/nodemailer");

const AuthEmail = async (user) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'ProjectTask - Confirma tu cuenta',
            text: 'ProjectTask - Confirma tu cuenta',
            html: `
                <p>Hola ${user.name}, has creado tu cuenta en <strong>ProjectTask</strong>, ya casi está todo listo, solo debes confirmar tu cuenta.</p>
                <p>Visita el siguiente enlace para verificar tu cuenta:</p>
                <p>ACA DEBE IR EL ENLACE DEL FRONT END</p>
                <p>E ingresa el código: <b></b></p>
                <p>Esta verificación expira en 10 minutos.</p>
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

module.exports =  AuthEmail ;

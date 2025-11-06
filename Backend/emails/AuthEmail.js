const { transporter, EMAIL_ENABLED } = require("../config/nodemailer");

const AuthEmail = async (user) => {
  try {
    if (!EMAIL_ENABLED) {
      console.log(
        `Email disabled: se omite el envío de confirmación para ${user.email}`
      );
      return {
        success: true,
        message: "Envío de correo deshabilitado en este entorno",
      };
    }

    const confirmationUrl = `${process.env.FRONTEND_URL}/confirm/${user.token}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "ProjectTask - Confirma tu cuenta",
      html: `
                <p>Hola ${user.name},</p>    
                <p>Gracias por registrarte en nuestra aplicación. Ahora solo debes confirmar tu cuenta para poder utilizarla.</p>          
                <p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p>
                <p><a href="${confirmationUrl}" target="_blank">${confirmationUrl}</a></p>
                <p>O ingresa el siguiente código en la aplicación: <strong>${user.token}</strong></p>
                <p>Este código expira en 10 minutos.</p>
            `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Correo enviado:", info.response);
    return { success: true, message: "Correo enviado correctamente" };
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    return { success: false, message: "Error al enviar el correo", error };
  }
};

module.exports = AuthEmail;

// dependencias importadas necesarias
const user = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AuthEmail = require("../emails/AuthEmail");
const generateToken = require("../utils/token");
const Token = require("../models/TokensModels");
const { EMAIL_ENABLED } = require("../config/nodemailer");

const register = (req, res) => {
  const { name, email, password, role } = req.body;

  user.findByEmail(email, (err, results) => {
    if (err)
      return res.status(500).json({ message: "Error en la base de datos" });
    if (results.length > 0)
      return res.status(400).json({ message: "Usuario ya existe" });

    user.create({ name, email, password, role }, (err, result) => {
      if (err)
        return res.status(500).json({ message: "Error al registrar usuario" });
      const userId = result.insertId;

      if (!EMAIL_ENABLED) {
        user.updateVerificationStatus(userId, true, (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              message: "Error al habilitar usuario sin verificacion",
            });
          }
          return res.status(201).json({
            message:
              "Usuario registrado. La verificacion por correo esta deshabilitada temporalmente.",
          });
        });
        return;
      }

      const token = generateToken();

      Token.saveToken(userId, token, (err) => {
        if (err)
          return res.status(500).json({ message: "Error al guardar el token" });

        AuthEmail({ email, name, token });

        return res.status(201).json({
          message: "Usuario registrado exitosamente. Verifica tu email.",
        });
      });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  user.findByEmail(email, (err, results) => {
    if (!email || !password) {
      return res.status(400).json({ message: "Debes llenar todos los campos" });
    } else if (results.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const userData = results[0];
    const isMatch = bcrypt.compareSync(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales invalidas" });
    }

    if (!userData.verify) {
      return res.status(400).json({
        message: "Usuario no verificado, por favor confirma tu cuenta",
      });
    }

    const token = jwt.sign(
      { id: userData.id, name: userData.name, role: userData.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    return res.status(200).json({ token, user: userData });
  });
};

const changePassword = async (req, res) => {
  const { userId } = req.params;
  const { currentPassword, newPassword } = req.body;

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporciono token de autenticacion" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err) => {
      if (err) {
        return res.status(401).json({ message: "Token invalido" });
      }
    });

    user.findById(userId, (err, results) => {
      if (err || results.length === 0) {
        return res.status(400).json({ message: "Usuario no encontrado" });
      }

      const userFound = results[0];
      const isMatch = bcrypt.compareSync(currentPassword, userFound.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Contrasena actual incorrecta" });
      }

      const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
      user.updatePassword(userId, hashedNewPassword, (updateErr) => {
        if (updateErr) {
          return res
            .status(500)
            .json({ message: "Error al cambiar la contrasena" });
        }
        res.status(200).json({ message: "Contrasena cambiada correctamente" });
      });
    });
  } catch (error) {
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};

const confirmAccount = (req, res) => {
  const { token } = req.params;

  Token.findToken(token, (err, result) => {
    if (err || !result) {
      return res.status(400).json({ message: "Token invalido o expirado" });
    }

    const userId = result.user_id;
    user.updateVerificationStatus(userId, true, (updateErr) => {
      if (updateErr) {
        return res.status(500).json({ message: "Error al verificar cuenta" });
      }
      Token.deleteToken(token, (deleteErr) => {
        if (deleteErr) {
          return res.status(500).json({ message: "Error al eliminar token" });
        }
        res.status(200).json({ message: "Cuenta verificada exitosamente" });
      });
    });
  });
};

const resendToken = (req, res) => {
  const { email } = req.body;

  user.findByEmail(email, (err, results) => {
    if (!email) {
      return res.status(400).json({ message: "Debes ingresar un email valido" });
    }
    if (err) {
      return res.status(500).json({ message: "Error en la base de datos" });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    if (!EMAIL_ENABLED) {
      return res.status(200).json({
        message:
          "El envio de correos esta deshabilitado temporalmente. No es necesario reenviar token.",
      });
    }

    const userId = results[0].id;
    const token = generateToken();

    Token.saveToken(userId, token, (saveErr) => {
      if (saveErr) {
        return res.status(500).json({ message: "Error al guardar el token" });
      }

      AuthEmail({ email, name: results[0].name, token });
      return res.status(200).json({
        message: "Token reenviado exitosamente. Verifica tu email.",
      });
    });
  });
};

module.exports = {
  register,
  login,
  changePassword,
  confirmAccount,
  resendToken,
};

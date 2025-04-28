const express = require("express");
const {
  register,
  login,
  confirmAccount,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/confirm-account/:token", confirmAccount);

module.exports = router;

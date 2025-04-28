const express = require("express");
const {
  register,
  login,
  confirmAccount,
  resendToken,
} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/confirm-account/:token", confirmAccount);
router.post("/resend-token", resendToken);

module.exports = router;

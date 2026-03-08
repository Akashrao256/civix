const express = require("express");
const router = express.Router();
<<<<<<< HEAD

const {
  registerUser,
  loginUser
=======
const {
  registerUser,
  loginUser,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword
>>>>>>> dc5b6e9b0ef57dc51244871082eba9d37a5754d0
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
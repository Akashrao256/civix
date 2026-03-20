const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyOTP,
  resendOtp,
  forgotPassword,
  verifyResetOTP,
  resetPassword
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;

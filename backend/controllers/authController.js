const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// REGISTER
exports.registerUser = async (req, res) => {

  try {

    const { fullName, email, password, location, role } = req.body;

    if (!fullName || !email || !password || !location) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be 6+ characters" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

<<<<<<< HEAD
    const hashedPassword = await bcrypt.hash(password, 10);
=======
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;
>>>>>>> dc5b6e9b0ef57dc51244871082eba9d37a5754d0

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      location,
      role,
<<<<<<< HEAD
      isApproved: role === "citizen"
=======
      otp,
      otpExpires,
      isVerified: false
>>>>>>> dc5b6e9b0ef57dc51244871082eba9d37a5754d0
    });

    await sendEmail(
      email,
      "Your Civix OTP Verification Code",
      `Your OTP is ${otp}. It will expire in 10 minutes.`
    );

    res.status(201).json({
<<<<<<< HEAD
      message: role === "official"
        ? "Registration submitted. Waiting for admin approval."
        : "User registered successfully"
=======
      message: "User Registered Successfully. OTP sent to email.",
      user
>>>>>>> dc5b6e9b0ef57dc51244871082eba9d37a5754d0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }

};

// VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user.role === "official" && !user.isApproved) {
      return res.status(403).json({
        message: "Account waiting for admin approval"
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in." });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
<<<<<<< HEAD

};
=======
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        message: "If an account exists with this email, reset OTP has been sent.",
      });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = resetOtp;
    user.resetOtpExpires = Date.now() + 10 * 60 * 1000;
    user.resetOtpVerified = false;
    await user.save({ validateBeforeSave: false });

    await sendEmail(
      email,
      "Your Civix Password Reset OTP",
      `Your password reset OTP is ${resetOtp}. It will expire in 10 minutes.`
    );

    res.status(200).json({
      message: "Password reset OTP sent successfully.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// VERIFY RESET OTP
exports.verifyResetOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    user.resetOtpVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: "Reset OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.resetOtpVerified) {
      return res.status(400).json({ message: "Please verify reset OTP before resetting password." });
    }

    if (!user.resetOtpExpires || user.resetOtpExpires < Date.now()) {
      return res.status(400).json({ message: "Reset OTP expired. Please request a new OTP." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    user.resetOtpVerified = false;
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful. Please login." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
>>>>>>> dc5b6e9b0ef57dc51244871082eba9d37a5754d0

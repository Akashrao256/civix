const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      location,
      role,
      isApproved: role === "citizen"
    });

    res.status(201).json({
      message: role === "official"
        ? "Registration submitted. Waiting for admin approval."
        : "User registered successfully"
    });

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

};
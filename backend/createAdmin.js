const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User"); // adjust path if needed

async function createAdmin() {
  try {
    // 🔌 Connect DB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // 🔍 Check if official already exists
    const adminExists = await User.findOne({ email: "admin@civix.com" });

    if (adminExists) {
      console.log("⚠️ Admin already exists with this email");
      process.exit();
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash("Admin123", 10);

    // 👤 Create Official Admin
    const admin = await User.create({
      fullName: "System Admin",
      email: "admin@civix.com",
      password: hashedPassword,
      role: "official", // ✅ STANDARD ROLE
      location: "India",
      isVerified: true,
      isApproved: true,
    });

    console.log("🎉 Admin created successfully!");
    console.log({
      email: admin.email,
      role: admin.role,
    });

    process.exit();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  }
}

createAdmin();

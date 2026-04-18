const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User"); // adjust path if needed

const deleteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "akashrao2562004@gmail.com";

    const result = await User.deleteOne({ email });

    if (result.deletedCount === 0) {
      console.log("❌ User not found");
    } else {
      console.log("✅ User deleted successfully");
    }

    mongoose.connection.close();
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

deleteUser();

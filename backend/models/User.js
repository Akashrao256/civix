const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["citizen", "official"],
    default: "citizen"
  },
  passwordResetToken: {
    type: String
  },
  passwordResetExpire: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);

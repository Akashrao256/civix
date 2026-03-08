const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  location: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["citizen", "official", "admin"],
    default: "citizen"
  },
<<<<<<< HEAD

  isApproved: {
    type: Boolean,
    default: function () {
      return this.role !== "official";
    }
=======
  isVerified: {
    type: Boolean,
    default: false
  },
  otp: {
    type: String
  },
  otpExpires: {
    type: Date
  },
  resetOtp: {
    type: String
  },
  resetOtpExpires: {
    type: Date
  },
  resetOtpVerified: {
    type: Boolean,
    default: false
  },
  passwordResetotp: {
    type: String
  },
  passwordResetExpires: {
    type: Date
>>>>>>> dc5b6e9b0ef57dc51244871082eba9d37a5754d0
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
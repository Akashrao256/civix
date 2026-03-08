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

  isApproved: {
    type: Boolean,
    default: function () {
      return this.role !== "official";
    }
  }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
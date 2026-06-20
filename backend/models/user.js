const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    mobile: {
      type: String,
      unique: true,
      sparse: true
    },

    password: {
      type: String,
      minlength: 6,
      required: true
    },

    skills: {
      type: [String],
      default: []
    },

    role: {
      type: String,
      enum: ["student", "teamLeader", "admin"],
      default: "student"
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);

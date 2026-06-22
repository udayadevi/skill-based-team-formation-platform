const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true
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
      required: true,
      unique: true,
      sparse: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6
    },

    experience: {
      type: String,
      required: true
    },

    role: {
      type: String,
      required: true
    },

    skills: {
      type: [String],
      default: []
    },

    github: {
      type: String,
      default: ""
    },

    linkedin: {
      type: String,
      default: ""
    },

    portfolio: {
      type: String,
      default: ""
    },

    bio: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }

  },

  {
    timestamps: true
  });

module.exports = mongoose.model(
  "User",
  userSchema
);
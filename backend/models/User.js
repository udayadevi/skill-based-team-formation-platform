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

    lookingFor: {
      type: String,
      default: ""
    },

    availability: {
      type: String,
      default: "Available for New Projects"
    },

    profileImage: {
      type: String,
      default: ""
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
      required: true
    },

    skills: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        level: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
          default: 3
        }
      }
    ],

    interests: {
      type: [String],
      default: []
    },

    commitmentHours: {
      type: Number,
      default: 20
    },

    reputationScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    },

    reputationBreakdown: {
      taskReliability: { type: Number, default: 80 },
      projectSuccess: { type: Number, default: 80 },
      collaborationScore: { type: Number, default: 80 }
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

    teamsJoined: {
      type: Number,
      default: 0
    },

    projectsWorked: {
      type: Number,
      default: 0
    },

    projectExperience: [
      {
        projectName: String,
        description: String,
        role: String
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    }

  },

  {
    timestamps: true
  });

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

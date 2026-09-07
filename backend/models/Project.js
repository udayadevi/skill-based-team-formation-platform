const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      enum: [
        "Web Development",
        "Mobile App",
        "Artificial Intelligence",
        "Machine Learning",
        "Cyber Security"
      ],
      required: true,
    },

    projectType: {
      type: String,
      enum: [
        "Startup",
        "Hackathon",
        "Academic Project",
        "Research",
        "Other"
      ],
      default: "Startup"
    },

    requiredSkills: [
      {
        name: {
          type: String,
          required: true,
          trim: true
        },
        requiredLevel: {
          type: Number,
          min: 1,
          max: 5,
          default: 3
        }
      }
    ],

    teamSize: {
      type: Number,
      default: 4,
      min: 2,
      max: 20
    },

    commitmentRequired: {
      type: String,
      default: "15-20 hrs/week"
    },

    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online",
    },

    status: {
      type: String,
      enum: ["Open", "Completed", "Closed"],
      default: "Open",
    },

    deadline: {
      type: Date,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);
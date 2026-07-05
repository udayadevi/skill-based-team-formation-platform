const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      required: true,
      trim: true
    },

    skillsRequired: {
      type: [String],
      default: []
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    maxMembers: {
      type: Number,
      required: true,
      min: 2,
      max: 20
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
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
      default: "Web Development"
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Online"
    },

    experienceLevel: {
      type: String,
      enum: [
        "Beginner",
        "Intermediate",
        "Advanced"
      ],
      default: "Beginner"
    },

    meetingPlatform: {
      type: String,
      enum: [
        "",
        "Google Meet",
        "Zoom",
        "Microsoft Teams",
        "Discord",
        "Slack"
      ],
      default: ""
    },

    deadline: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", teamSchema);
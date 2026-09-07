const mongoose = require("mongoose");

const joinRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },

  message: {
    type: String,
    default: "",
    trim: true,
  },

  compatibilityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },

  scoreBreakdown: {
    skillMatch: { type: Number, default: 0 },
    proficiencyMatch: { type: Number, default: 0 },
    commitmentMatch: { type: Number, default: 0 },
    executionReliability: { type: Number, default: 0 },
    collaboration: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model("JoinRequest", joinRequestSchema);
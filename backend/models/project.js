const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  requiredSkills: {
    type: [String],
    default: [],
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Project", projectSchema);
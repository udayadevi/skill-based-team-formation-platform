const Team = require("../models/Team");
const mongoose = require("mongoose");

/* ================= CREATE TEAM ================= */
const createTeam = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { name, description = "", skillsRequired = [] } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Team name required" });
    }

    const team = await Team.create({
      name: name.trim(),
      description,
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      createdBy: req.user._id,
      members: [req.user._id]
    });

    return res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET ALL TEAMS ================= */
const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find()
      .populate("createdBy", "name email")
      .populate("members", "name email");

    return res.status(200).json({ success: true, data: teams });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= GET TEAM BY ID ================= */
const getTeamById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const team = await Team.findById(id)
      .populate("createdBy", "name email")
      .populate("members", "name email");

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    return res.status(200).json({ success: true, data: team });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= JOIN TEAM ================= */
const joinTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const userId = req.user._id.toString();

    if (team.members.some(m => m.toString() === userId)) {
      return res.status(400).json({ success: false, message: "Already joined" });
    }

    if (team.members.length >= 10) {
      return res.status(400).json({ success: false, message: "Team full" });
    }

    team.members.push(req.user._id);
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Joined successfully",
      data: team
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= UPDATE TEAM ================= */
const updateTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // only creator allowed
    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed , Only Creator can Update Team"
      });
    }

    const { name, description, skillsRequired } = req.body || {};

    const updated = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name: name ?? team.name,
        description: description ?? team.description,
        skillsRequired: Array.isArray(skillsRequired)
          ? skillsRequired
          : team.skillsRequired
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Team updated successfully",
      data: updated
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
/* ================= DELETE TEAM ================= */
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // only creator can delete
    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not allowed"
      });
    }

    // REMOVE members.length check completely

    await Team.deleteOne({ _id: req.params.id });

    return res.status(200).json({
      success: true,
      message: "Team deleted successfully"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
/* ================= LEAVE TEAM ================= */
const leaveTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    const userId = req.user._id.toString();

    if (team.createdBy.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Creator cannot leave team. Transfer ownership first."
      });
    }

    if (!team.members.some(m => m.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this team"
      });
    }

    team.members = team.members.filter(
      m => m.toString() !== userId
    );

    await team.save();

    return res.status(200).json({
      success: true,
      message: "Left successfully",
      data: team
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/* ================= ADD MEMBER ================= */
const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed , Only creator can add member" });
    }

    if (team.members.some(m => m.toString() === userId)) {
      return res.status(400).json({ success: false, message: "Already member" });
    }

    if (team.members.length >= 10) {
      return res.status(400).json({ success: false, message: "Team full" });
    }

    team.members.push(userId);
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Member added",
      data: team
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/* ================= REMOVE MEMBER ================= */
const removeMember = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed , only team creator can remove member" });
    }

    team.members = team.members.filter(m => m.toString() !== userId);
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Member removed",
      data: team
    });

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  getTeamById,
  joinTeam,
  updateTeam,
  deleteTeam,
  leaveTeam,
  addMember,
  removeMember
};
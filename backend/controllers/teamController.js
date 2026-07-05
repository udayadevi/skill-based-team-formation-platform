const Team = require("../models/Team");
const mongoose = require("mongoose");
const User = require("../models/User");
const Project = require("../models/project");

/* ================= CREATE TEAM ================= */
const createTeam = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const {
      name,
      project,
      description = "",
      skillsRequired = [],
      maxMembers,
      category,
      mode,
      experienceLevel,
      meetingPlatform,
      deadline
    } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ success: false, message: "Team name required" });
    }

    if (!project) {
      return res.status(400).json({
        success: false,
        message: "Project is required",
      });
    }

    const existingProject = await Project.findById(project);

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    if (!description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description is required"
      });
    }

    if (!maxMembers || maxMembers < 2 || maxMembers > 20) {
      return res.status(400).json({
        success: false,
        message: "Maximum members must be between 2 and 20"
      });
    }

    if (!deadline) {
      return res.status(400).json({
        success: false,
        message: "Deadline is required"
      });
    }

    const selectedDate = new Date(deadline);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: "Deadline cannot be in the past"
      });
    }

    const team = await Team.create({
      name: name.trim(),
      project,
      description: description.trim(),
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired.map(skill => skill.trim()).filter(Boolean)
        : [],
      maxMembers,
      category,
      mode,
      experienceLevel,
      meetingPlatform,
      deadline,
      createdBy: req.user._id,
      members: [req.user._id]
    });

    await team.populate(
      "createdBy",
      "firstName lastName email"
    );

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
      .sort({ createdAt: -1 })
      .populate(
        "createdBy",
        "firstName lastName email"
      )
      .populate(
        "members",
        "firstName lastName email"
      )
      .populate(
        "project",
        "projectName category status"
      )

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
      .populate(
        "createdBy",
        "firstName lastName email"
      )
      .populate(
        "members",
        "firstName lastName email"
      )
      .populate("project",
        "projectName category description requiredSkills"
      )
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

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ success: false, message: "Team full" });
    }

    team.members.push(req.user._id);
    await team.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { teamsJoined: 1 },
    });

    await team.populate(
      "members",
      "firstName lastName email"
    );

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

    const {
      name,
      project,
      description,
      skillsRequired,
      maxMembers,
      category,
      mode,
      experienceLevel,
      meetingPlatform,
      deadline
    } = req.body || {};


    if (name !== undefined && !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Team name cannot be empty",
      });
    }

    if (description !== undefined && !description.trim()) {
      return res.status(400).json({
        success: false,
        message: "Description cannot be empty",
      });
    }

    if (project) {
      const existingProject = await Project.findById(project);

      if (!existingProject) {
        return res.status(404).json({
          success: false,
          message: "Project not found",
        });
      }
    }

    if (maxMembers !== undefined) {
      if (maxMembers < 2 || maxMembers > 20) {
        return res.status(400).json({
          success: false,
          message: "Maximum members must be between 2 and 20"
        });
      }

      if (maxMembers < team.members.length) {
        return res.status(400).json({
          success: false,
          message: "Maximum members cannot be less than current team size"
        });
      }
    }

    if (deadline) {
      const selectedDate = new Date(deadline);
      selectedDate.setHours(0, 0, 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        return res.status(400).json({
          success: false,
          message: "Deadline cannot be in the past",
        });
      }
    }

    const updated = await Team.findByIdAndUpdate(
      req.params.id,
      {
        name: name ?? team.name,
        project: project ?? team.project,
        description: description?.trim() ?? team.description,
        skillsRequired: Array.isArray(skillsRequired)
          ? skillsRequired.map(skill => skill.trim()).filter(Boolean)
          : team.skillsRequired,
        maxMembers: maxMembers ?? team.maxMembers,
        category: category ?? team.category,
        mode: mode ?? team.mode,
        experienceLevel: experienceLevel ?? team.experienceLevel,
        meetingPlatform: meetingPlatform ?? team.meetingPlatform,
        deadline: deadline ?? team.deadline,
      },
      { new: true }
    );

    await updated.populate(
      "createdBy",
      "firstName lastName email"
    );

    await updated.populate(
      "members",
      "firstName lastName email"
    );

    await updated.populate(
      "project",
      "projectName category"
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

    await team.populate(
      "members",
      "firstName lastName email"
    );

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        teamsJoined: -1
      }
    });

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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
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

    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ success: false, message: "Team full" });
    }

    team.members.push(userId);
    await team.save();

    await team.populate(
      "members",
      "firstName lastName email"
    );

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

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    if (team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not allowed , only team creator can remove member" });
    }

    if (team.createdBy.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Cannot remove the team creator"
      });
    }

    if (!team.members.some(m => m.toString() === userId)) {
      return res.status(400).json({
        success: false,
        message: "User is not a member of this team"
      });
    }

    team.members = team.members.filter(
      m => m.toString() !== userId
    );

    await team.save();

    await User.findByIdAndUpdate(userId, {
      $inc: {
        teamsJoined: -1
      }
    });

    await team.populate(
      "members",
      "firstName lastName email"
    );

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
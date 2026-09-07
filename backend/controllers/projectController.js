const Project = require("../models/Project");
const User = require("../models/User");
const { calculateCompatibility, normalizeSkills } = require("../services/compatibilityService");

// CREATE PROJECT (Phase 4)
const createProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      category,
      projectType = "Startup",
      requiredSkills = [],
      experienceLevel = "Beginner",
      mode = "Online",
      status = "Open",
      teamSize = 4,
      commitmentRequired = "15-20 hrs/week",
      deadline,
    } = req.body;

    // VALIDATION
    if (!projectName?.trim()) {
      return res.status(400).json({ success: false, message: "Project name is required" });
    }

    if (!description?.trim()) {
      return res.status(400).json({ success: false, message: "Description is required" });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: "Category is required" });
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

    // Format required skills to [{ name, requiredLevel }]
    const formattedSkills = Array.isArray(requiredSkills)
      ? requiredSkills
          .map((s) => {
            if (typeof s === "string" && s.trim()) {
              return { name: s.trim(), requiredLevel: 3 };
            }
            if (s && typeof s === "object" && s.name) {
              return {
                name: String(s.name).trim(),
                requiredLevel: Math.max(1, Math.min(5, Number(s.requiredLevel || s.level) || 3)),
              };
            }
            return null;
          })
          .filter(Boolean)
      : [];

    // CREATE PROJECT
    const project = await Project.create({
      projectName: projectName.trim(),
      description: description.trim(),
      category,
      projectType,
      requiredSkills: formattedSkills,
      teamSize: Number(teamSize) || 4,
      commitmentRequired,
      experienceLevel,
      mode,
      status,
      deadline,
      createdBy: req.user?._id,
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PROJECT BY ID
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "firstName lastName email"
    );

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET RECOMMENDED PROJECTS WITH COMPATIBILITY SCORING (Phase 5 & 6)
const getRecommendedProjects = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const projects = await Project.find({ status: "Open" })
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    const scoredProjects = await Promise.all(
      projects.map(async (project) => {
        const scoreResult = await calculateCompatibility(user, project);
        return {
          ...project.toObject(),
          compatibilityScore: scoreResult.overallScore,
          matchedSkills: scoreResult.matchedSkills,
          missingSkills: scoreResult.missingSkills,
          breakdown: scoreResult.breakdown,
        };
      })
    );

    // Sort by compatibility score descending
    scoredProjects.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    return res.status(200).json({
      success: true,
      data: scoredProjects,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SPECIFIC PROJECT COMPATIBILITY (Phase 5)
const getProjectCompatibility = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(userId);
    const project = await Project.findById(req.params.id);

    if (!user || !project) {
      return res.status(404).json({ success: false, message: "User or project not found" });
    }

    const scoreResult = await calculateCompatibility(user, project);

    return res.status(200).json({
      success: true,
      data: {
        projectId: project._id,
        projectName: project.projectName,
        ...scoreResult,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  getRecommendedProjects,
  getProjectCompatibility,
};
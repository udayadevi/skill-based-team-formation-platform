const Project = require("../models/project");

// CREATE PROJECT (FIXED)
const createProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      category,
      requiredSkills,
      experienceLevel,
      mode,
      status,
      deadline,
    } = req.body;

    // VALIDATION
    if (!projectName?.trim())
      return res.status(400).json({ message: "Project name is required" });

    if (!description?.trim())
      return res.status(400).json({ message: "Description is required" });

    if (!category)
      return res.status(400).json({ message: "Category is required" });

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

    // CREATE PROJECT
    const project = await Project.create({
      projectName: projectName.trim(),
      description: description.trim(),
      category,
      requiredSkills: Array.isArray(requiredSkills)
        ? requiredSkills
          .map((s) => s.trim())
          .filter(Boolean)
        : [],
      experienceLevel,
      mode,
      status,
      deadline,
      createdBy: req.user?._id, // IMPORTANT (if auth exists)
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
    const projects = await Project.find().sort({ createdAt: -1 });

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

module.exports = {
  createProject,
  getProjects,
};
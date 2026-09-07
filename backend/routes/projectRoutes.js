const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  getRecommendedProjects,
  getProjectCompatibility,
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");

// GET RECOMMENDED PROJECTS (Phase 6)
router.get("/recommended", protect, getRecommendedProjects);

// GET PROJECT COMPATIBILITY (Phase 5)
router.get("/:id/compatibility", protect, getProjectCompatibility);

// CREATE PROJECT (LOGIN REQUIRED)
router.post("/", protect, createProject);

// GET ALL PROJECTS
router.get("/", getProjects);

// GET SINGLE PROJECT
router.get("/:id", getProjectById);

module.exports = router;
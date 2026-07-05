const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
} = require("../controllers/projectcontroller");

const protect = require("../middleware/authMiddleware");

// CREATE PROJECT (LOGIN REQUIRED)
router.post("/", protect, createProject);

// GET PROJECTS (OPTIONAL: keep protected or open)
router.get("/", protect, getProjects);

module.exports = router;
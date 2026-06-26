const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
} = require("../controllers/projectcontroller");

// Create Project
router.post("/", createProject);

// Get All Projects
router.get("/", getProjects);

module.exports = router;
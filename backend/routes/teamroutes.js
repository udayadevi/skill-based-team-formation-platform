const express = require("express");
const router = express.Router();

const {
  createTeam,
  getTeams,
  calculateMatch,
} = require("../controllers/teamcontroller");

// Create Team
router.post("/", createTeam);

// Get All Teams
router.get("/", getTeams);

module.exports = router;
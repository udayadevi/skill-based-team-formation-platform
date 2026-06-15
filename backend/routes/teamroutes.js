const express = require("express");
const router = express.Router();

const {
  createTeam,
  getAllTeams,
  getTeamById,
  joinTeam,
  updateTeam,
  deleteTeam,
  leaveTeam,
  addMember,
  removeMember
} = require("../controllers/teamController");

const protect = require("../middleware/authMiddleware");

// CREATE TEAM
router.post("/create", protect, createTeam);

// GET ALL TEAMS
router.get("/", protect, getAllTeams);

// GET TEAM BY ID
router.get("/:id", protect, getTeamById);

// JOIN TEAM
router.put("/join/:id", protect, joinTeam);

// UPDATE TEAM
router.put("/:id", protect, updateTeam);

// DELETE TEAM
router.delete("/:id", protect, deleteTeam);

// LEAVE TEAM
router.put("/leave/:id", protect, leaveTeam);

// ADD MEMBER 
router.put("/add-member/:id", protect, addMember);

// REMOVE MEMBER
router.put("/remove-member/:id", protect, removeMember);

module.exports = router;

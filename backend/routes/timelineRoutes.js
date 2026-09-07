const express = require("express");
const router = express.Router();

const {
  getTeamTimeline,
  getProjectTimeline,
  addTimelineEvent,
} = require("../controllers/timelineController");

const protect = require("../middleware/authMiddleware");

// Collaboration Timeline endpoints (Phase 11)
router.get("/team/:teamId", protect, getTeamTimeline);
router.get("/project/:projectId", protect, getProjectTimeline);
router.post("/", protect, addTimelineEvent);

module.exports = router;

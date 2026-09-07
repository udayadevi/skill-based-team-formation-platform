const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  getMe,
  getProfile,
  updateProfile,
  changePassword,
  getUserAnalytics,
  getUserContributions,
  getUserSkillGraph,
} = require("../controllers/userController");

// My Profile
router.get(
  "/me",
  protect,
  getMe
);

// Analytics & Metrics (Phase 9 & 10)
router.get("/me/analytics", protect, getUserAnalytics);
router.get("/:id/analytics", protect, getUserAnalytics);

// Contribution History (Phase 8)
router.get("/me/contributions", protect, getUserContributions);
router.get("/:id/contributions", protect, getUserContributions);

// Skill Graph Data (Phase 3)
router.get("/me/skill-graph", protect, getUserSkillGraph);
router.get("/:id/skill-graph", protect, getUserSkillGraph);

// Public Profile
router.get(
  "/profile/:id",
  getProfile
);

// Update Profile
router.put(
  "/update-profile",
  protect,
  updateProfile
);

// Change Password
router.put(
  "/change-password",
  protect,
  changePassword
);

module.exports = router;


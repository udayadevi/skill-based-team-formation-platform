const express = require("express");

const router = express.Router();

const protect =
  require("../middleware/authMiddleware");

const {
  getMe,
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/userController");

// My Profile
router.get(
  "/me",
  protect,
  getMe
);

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

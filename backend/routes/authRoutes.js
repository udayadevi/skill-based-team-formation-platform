const express = require("express");

const router = express.Router();

const { body } =
  require("express-validator");

const protect =
  require("../middleware/authMiddleware");

const {
  registerUser,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
  resetPassword
} = require("../controllers/authController");

// Register
router.post(
  "/register",
  [
    body("firstName")
      .notEmpty()
      .withMessage("First name is required"),

    body("lastName")
      .notEmpty()
      .withMessage("last name is required"),

    body("email")
      .isEmail().normalizeEmail()
      .withMessage("Invalid email"),

    body("password")
      .isLength({ min: 6 })
      .withMessage(
        "Password must be at least 6 characters"
      ),

    body("mobile")
      .notEmpty()
      .withMessage("Mobile is required")
      .isLength({ min: 10, max: 10 })
      .withMessage("Mobile number must be 10 digits")
      .isNumeric()
      .withMessage("Mobile must contain only numbers"),

    body("experience")
      .notEmpty()
      .withMessage("Experience is required"),

    body("role")
      .notEmpty()
      .withMessage("Role is required"),

    body("skills")
      .notEmpty()
      .withMessage("Skills are required")
  ],
  registerUser
);

// Login
router.post(
  "/login",
  [
    body("email")
      .isEmail().normalizeEmail()
      .withMessage("Invalid email"),

    body("password")
      .notEmpty()
      .withMessage("Password required")
  ],
  loginUser
);

// Logout
router.post(
  "/logout",
  protect,
  logoutUser
);

// OTP
router.post(
  "/send-otp",
  [
    body("email")
      .isEmail().normalizeEmail()
      .withMessage("Valid email required")
  ],
  sendOtp
);

// verify otp
router.post(
  "/verify-otp",
  [
    body("email")
      .isEmail().normalizeEmail()
      .withMessage("Valid email required"),

    body("otp")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
  ],
  verifyOtp
);

// Reset Password
router.post(
  "/reset-password",
  [
    body("email")
      .isEmail().normalizeEmail()
      .withMessage("Valid email required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
      .not()
      .contains("password")

  ],
  resetPassword
);

module.exports = router;

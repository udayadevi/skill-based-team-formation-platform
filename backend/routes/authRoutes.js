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
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

// Register
router.post(
  "/register",
  [
    body("name")
      .notEmpty()
      .withMessage("Name is required"),

    body("email")
      .isEmail()
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
      .withMessage("Mobile must contain only numbers")
  ],
  registerUser
);

// Login
router.post(
  "/login",
  [
    body("email")
      .isEmail()
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
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required")
  ],
  sendOtp
);

// verify otp
router.post(
  "/verify-otp",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required"),

    body("otp")
      .isNumeric()
      .withMessage("OTP must be a number")
      .isLength({ min: 6, max: 6 })
      .withMessage("OTP must be 6 digits")
  ],
  verifyOtp
);

// Forgot Password
router.post(
  "/forgot-password",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required")
  ],
  forgotPassword
);

// Reset Password
router.post(
  "/reset-password",
  [
    body("email")
      .isEmail()
      .withMessage("Valid email required"),

    body("otp")
      .notEmpty()
      .withMessage("OTP required"),

    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters")
  ],
  resetPassword
);

module.exports = router;

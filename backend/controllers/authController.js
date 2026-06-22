const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const sendEmail = require("../utils/emailServices");

// OTP store (ONLY ONCE)
const otpStore = new Map();

// JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* ---------------- REGISTER ---------------- */
const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let {
      firstName,
      lastName,
      email,
      mobile,
      password,
      experience,
      role,
      skills,
      github,
      linkedin,
      portfolio,
      bio,
    } = req.body;

    email = email.toLowerCase().trim();
    mobile = mobile?.trim();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email,
      mobile,
      password: hashedPassword,
      experience,
      role,
      github,
      linkedin,
      portfolio,
      bio,
      skills:
        typeof skills === "string"
          ? skills.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- LOGIN ---------------- */
const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    let { email, password } = req.body;
    email = email.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid password" });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- LOGOUT ---------------- */
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out (remove token from client)",
  });
};

/* ---------------- SEND OTP ---------------- */
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    otpStore.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      verified: false,
    });

    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);

    await sendEmail(
      email,
      "OTP Verification",
      `<h2>Your OTP</h2><h1>${otp}</h1>`
    );

    return res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- VERIFY OTP ---------------- */
const verifyOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;

    email = email.toLowerCase().trim();

    const data = otpStore.get(email);

    if (!data) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    if (Date.now() > data.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (String(data.otp) !== String(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    otpStore.set(email, { ...data, verified: true });

    return res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/* ---------------- RESET PASSWORD ---------------- */
const resetPassword = async (req, res) => {
  try {
    let { email, newPassword } = req.body;
    email = email.toLowerCase().trim();

    const data = otpStore.get(email);

    if (!data || !data.verified) {
      return res.status(400).json({ success: false, message: "OTP not verified" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    otpStore.delete(email);

    return res.json({ success: true, message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  sendOtp,
  verifyOtp,
  resetPassword,
};
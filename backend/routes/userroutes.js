const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  getUsers,
  updateUser,
} = require("../controllers/userController");

// Register User
router.post("/", createUser);

// Login User
router.post("/login", loginUser);

// Get All Users
router.get("/", getUsers);

// Update User Profile
router.put("/:id", updateUser);

module.exports = router;
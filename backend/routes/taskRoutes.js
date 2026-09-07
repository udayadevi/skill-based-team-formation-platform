const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasksByTeam,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");

// Task management endpoints (Phases 8 & 9)
router.post("/", protect, createTask);
router.get("/my-tasks", protect, getMyTasks);
router.get("/team/:teamId", protect, getTasksByTeam);
router.put("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);

module.exports = router;

const Task = require("../models/Task");
const Team = require("../models/Team");
const User = require("../models/User");
const CollaborationEvent = require("../models/CollaborationEvent");
const { recalculateUserReputation } = require("../services/reputationService");

// CREATE & ASSIGN TASK (Phase 8)
const createTask = async (req, res) => {
  try {
    const { title, description = "", teamId, assignedTo, priority = "Medium", skill = "", dueDate } = req.body;

    if (!title?.trim()) {
      return res.status(400).json({ success: false, message: "Task title is required" });
    }

    if (!teamId) {
      return res.status(400).json({ success: false, message: "Team ID is required" });
    }

    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    // Default assignee to creator or specified member
    const targetAssigneeId = assignedTo || req.user._id;
    const assignee = await User.findById(targetAssigneeId);

    if (!assignee) {
      return res.status(404).json({ success: false, message: "Assignee user not found" });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description.trim(),
      team: teamId,
      project: team.project,
      assignedTo: targetAssigneeId,
      assignedBy: req.user._id,
      priority,
      skill: skill.trim(),
      dueDate: dueDate ? new Date(dueDate) : null,
      status: "pending",
    });

    await task.populate("assignedTo", "firstName lastName email");
    await task.populate("assignedBy", "firstName lastName email");

    // Log Collaboration Event (Phase 11)
    try {
      await CollaborationEvent.create({
        team: teamId,
        project: team.project,
        user: targetAssigneeId,
        type: "task_assigned",
        title: `Task Assigned: ${title}`,
        description: `Assigned to ${assignee.firstName} ${assignee.lastName} (Priority: ${priority})`,
        metadata: { taskId: task._id, skill },
      });
    } catch (e) {
      console.error("Timeline log error:", e.message);
    }

    return res.status(201).json({
      success: true,
      message: "Task created and assigned successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET TASKS BY TEAM
const getTasksByTeam = async (req, res) => {
  try {
    const { teamId } = req.params;

    const tasks = await Task.find({ team: teamId })
      .populate("assignedTo", "firstName lastName email role")
      .populate("assignedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET MY TASKS
const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("team", "name category")
      .populate("assignedBy", "firstName lastName")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE TASK STATUS (Phase 8 & 9)
const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "in_progress", "completed"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "firstName lastName email")
      .populate("team");

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    task.status = status;
    if (status === "completed") {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }

    await task.save();

    // If completed, log Collaboration Timeline Event
    if (status === "completed") {
      try {
        await CollaborationEvent.create({
          team: task.team._id || task.team,
          project: task.project,
          user: task.assignedTo._id || task.assignedTo,
          type: "task_completed",
          title: `Task Completed: ${task.title}`,
          description: `${task.assignedTo.firstName || "Member"} completed task "${task.title}"`,
          metadata: { taskId: task._id, skill: task.skill },
        });

        // Recalculate reputation & execution analytics
        await recalculateUserReputation(task.assignedTo._id || task.assignedTo);
      } catch (e) {
        console.error("Timeline/Reputation update error:", e.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: `Task marked as ${status}`,
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE TASK
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasksByTeam,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
};

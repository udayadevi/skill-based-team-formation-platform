const CollaborationEvent = require("../models/CollaborationEvent");

// GET TEAM TIMELINE (Phase 11)
const getTeamTimeline = async (req, res) => {
  try {
    const { teamId } = req.params;

    const events = await CollaborationEvent.find({ team: teamId })
      .populate("user", "firstName lastName email profileImage role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET PROJECT TIMELINE
const getProjectTimeline = async (req, res) => {
  try {
    const { projectId } = req.params;

    const events = await CollaborationEvent.find({ project: projectId })
      .populate("user", "firstName lastName email profileImage role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ADD CUSTOM EVENT (e.g. Milestone or Feedback)
const addTimelineEvent = async (req, res) => {
  try {
    const { teamId, projectId, type = "milestone_completed", title, description = "", metadata = {} } = req.body;

    if (!teamId || !title?.trim()) {
      return res.status(400).json({ success: false, message: "Team ID and title are required" });
    }

    const event = await CollaborationEvent.create({
      team: teamId,
      project: projectId,
      user: req.user?._id,
      type,
      title: title.trim(),
      description: description.trim(),
      metadata,
    });

    await event.populate("user", "firstName lastName email profileImage role");

    return res.status(201).json({
      success: true,
      message: "Timeline event recorded",
      data: event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getTeamTimeline,
  getProjectTimeline,
  addTimelineEvent,
};

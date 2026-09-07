const JoinRequest = require("../models/JoinRequest");
const Team = require("../models/Team");
const User = require("../models/User");
const CollaborationEvent = require("../models/CollaborationEvent");
const { calculateCompatibility } = require("../services/compatibilityService");

// CREATE JOIN REQUEST (Phase 7)
const createJoinRequest = async (req, res) => {
  try {
    const userId = req.user?._id || req.body.userId;
    const { teamId, message = "" } = req.body;

    if (!userId || !teamId) {
      return res.status(400).json({ success: false, message: "User ID and Team ID are required" });
    }

    const team = await Team.findById(teamId).populate("project");
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Check if already in team
    if (team.members.some((m) => m.toString() === userId.toString())) {
      return res.status(400).json({ success: false, message: "You are already a member of this team" });
    }

    // Check if pending request already exists
    const existingReq = await JoinRequest.findOne({
      userId,
      teamId,
      status: "pending",
    });

    if (existingReq) {
      return res.status(400).json({ success: false, message: "A pending join request already exists" });
    }

    // Calculate real compatibility for applicant
    const compResult = await calculateCompatibility(user, team);

    const joinRequest = await JoinRequest.create({
      userId,
      teamId,
      message: message.trim(),
      compatibilityScore: compResult.overallScore,
      scoreBreakdown: compResult.breakdown,
      status: "pending",
    });

    await joinRequest.populate("userId", "firstName lastName email skills role reputationScore");
    await joinRequest.populate("teamId", "name");

    return res.status(201).json({
      success: true,
      message: "Join request submitted successfully",
      data: joinRequest,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET JOIN REQUESTS (Phase 7 - Creator View)
const getJoinRequests = async (req, res) => {
  try {
    const { teamId } = req.query;
    const filter = {};

    if (teamId) {
      filter.teamId = teamId;
    }

    // If user is authenticated, find requests for teams created by this user or applied by this user
    const requests = await JoinRequest.find(filter)
      .populate("userId", "firstName lastName email skills role reputationScore availability experience")
      .populate({
        path: "teamId",
        select: "name category createdBy members maxMembers",
        populate: { path: "createdBy", select: "firstName lastName email" },
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: requests,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ACCEPT JOIN REQUEST
const acceptJoinRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id)
      .populate("userId", "firstName lastName email")
      .populate("teamId");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    const team = await Team.findById(request.teamId._id || request.teamId);
    if (!team) {
      return res.status(404).json({ success: false, message: "Team not found" });
    }

    // Check creator permission if auth is present
    if (req.user && team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only team creator can accept requests" });
    }

    // Check team capacity
    if (team.members.length >= team.maxMembers) {
      return res.status(400).json({ success: false, message: "Team has reached maximum capacity" });
    }

    // Add user to team if not already in team
    const applicantId = request.userId._id || request.userId;
    if (!team.members.some((m) => m.toString() === applicantId.toString())) {
      team.members.push(applicantId);
      await team.save();

      await User.findByIdAndUpdate(applicantId, {
        $inc: { teamsJoined: 1 },
      });
    }

    request.status = "accepted";
    await request.save();

    // Log Collaboration Timeline Event
    try {
      await CollaborationEvent.create({
        team: team._id,
        project: team.project,
        user: applicantId,
        type: "member_joined",
        title: "New Team Member Accepted",
        description: `${request.userId.firstName || "Applicant"} was accepted into ${team.name} (Compatibility: ${request.compatibilityScore}%)`,
      });
    } catch (e) {
      console.error("Timeline log error:", e.message);
    }

    return res.status(200).json({
      success: true,
      message: "Applicant accepted into team",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// REJECT JOIN REQUEST
const rejectJoinRequest = async (req, res) => {
  try {
    const request = await JoinRequest.findById(req.params.id).populate("teamId");

    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    const team = await Team.findById(request.teamId._id || request.teamId);
    if (team && req.user && team.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Only team creator can reject requests" });
    }

    request.status = "rejected";
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Join request rejected",
      data: request,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update status (compatibility backward compatibility)
const updateJoinRequestStatus = async (req, res) => {
  const { status } = req.body;
  if (status === "accepted") return acceptJoinRequest(req, res);
  if (status === "rejected") return rejectJoinRequest(req, res);

  try {
    const request = await JoinRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createJoinRequest,
  getJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  updateJoinRequestStatus,
};

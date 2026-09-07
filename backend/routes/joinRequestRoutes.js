const express = require("express");
const router = express.Router();

const {
  createJoinRequest,
  getJoinRequests,
  acceptJoinRequest,
  rejectJoinRequest,
  updateJoinRequestStatus,
} = require("../controllers/joinRequestController");

const protect = require("../middleware/authMiddleware");

// Create Join Request (Phase 7)
router.post("/", protect, createJoinRequest);

// Get All Join Requests (Creator / User View)
router.get("/", protect, getJoinRequests);

// Accept Join Request
router.put("/:id/accept", protect, acceptJoinRequest);

// Reject Join Request
router.put("/:id/reject", protect, rejectJoinRequest);

// Legacy patch/put update
router.patch("/:id", protect, updateJoinRequestStatus);
router.put("/:id", protect, updateJoinRequestStatus);

module.exports = router;
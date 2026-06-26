const JoinRequest = require("../models/joinRequest");

// Create Join Request
const createJoinRequest = async (req, res) => {
  try {
    const joinRequest = await JoinRequest.create(req.body);
    res.status(201).json(joinRequest);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Join Requests
const getJoinRequests = async (req, res) => {
  try {
    const requests = await JoinRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Accept / Reject Join Request
const updateJoinRequestStatus = async (req, res) => {
  try {
    const request = await JoinRequest.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJoinRequest,
  getJoinRequests,
  updateJoinRequestStatus,
};

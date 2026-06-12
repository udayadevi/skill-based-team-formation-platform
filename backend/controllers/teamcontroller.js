const Team = require("../models/team");

// Create Team
const createTeam = async (req, res) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Teams
const getTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const calculateMatch = (userSkills, requiredSkills) => {
  const matchedSkills = userSkills.filter(skill =>
    requiredSkills.includes(skill)
  );

  const score =
    requiredSkills.length === 0
      ? 0
      : (matchedSkills.length / requiredSkills.length) * 100;

  return {
    matchedSkills,
    score: score.toFixed(2),
  };
};

module.exports = {
  createTeam,
  getTeams,
  calculateMatch,
};
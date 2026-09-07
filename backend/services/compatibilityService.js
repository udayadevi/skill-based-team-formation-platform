/**
 * Compatibility Scoring Service
 *
 * Implements a transparent, multi-factor compatibility scoring engine
 * between a User and a Project/Team.
 *
 * Factors evaluated:
 * 1. Skill Match & Coverage (40%): What % of required skills the user possesses.
 * 2. Proficiency Match (20%): How closely the user's proficiency (1-5) meets the required level.
 * 3. Commitment / Availability Match (15%): User availability alignment with project needs.
 * 4. Execution Reliability (15%): Historical task completion and overdue rate from MongoDB.
 * 5. Collaboration & Reputation (10%): User's dynamic reputation score and project track record.
 */

const Task = require("../models/Task");

/**
 * Normalizes skill input into array of { name: string, level: number }
 */
const normalizeSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills
    .map((s) => {
      if (typeof s === "string") {
        return { name: s.trim(), level: 3 };
      }
      if (s && typeof s === "object" && s.name) {
        return {
          name: String(s.name).trim(),
          level: Number(s.level || s.requiredLevel || 3),
        };
      }
      return null;
    })
    .filter(Boolean);
};

/**
 * Calculates compatibility score and transparent breakdown
 * @param {Object} user - Mongoose User document or plain object
 * @param {Object} target - Project or Team document or object
 * @returns {Promise<Object>} Scoring result with overall % and factor breakdowns
 */
const calculateCompatibility = async (user, target) => {
  if (!user || !target) {
    return {
      overallScore: 50,
      matchedSkills: [],
      missingSkills: [],
      breakdown: {
        skillMatch: 50,
        proficiencyMatch: 50,
        commitmentMatch: 50,
        executionReliability: 50,
        collaboration: 50,
      },
    };
  }

  // 1. SKILL MATCHING & COVERAGE
  const userSkills = normalizeSkills(user.skills);
  const requiredSkillsRaw =
    target.requiredSkills || target.skillsRequired || [];
  const requiredSkills = normalizeSkills(requiredSkillsRaw);

  const matchedSkills = [];
  const missingSkills = [];
  let totalProficiencyFactor = 0;

  if (requiredSkills.length === 0) {
    // If no specific skills required, default to general match
    matchedSkills.push("General");
  } else {
    requiredSkills.forEach((req) => {
      const userMatch = userSkills.find(
        (u) => u.name.toLowerCase() === req.name.toLowerCase()
      );

      if (userMatch) {
        matchedSkills.push(req.name);
        // Compare user level to required level (ratio up to 1.0)
        const ratio = Math.min(1.0, userMatch.level / (req.level || 3));
        totalProficiencyFactor += ratio;
      } else {
        missingSkills.push(req.name);
      }
    });
  }

  const coverageRatio =
    requiredSkills.length > 0
      ? matchedSkills.length / requiredSkills.length
      : 0.85;

  const skillCoverageScore = Math.round(coverageRatio * 100);

  const proficiencyScore =
    matchedSkills.length > 0
      ? Math.round((totalProficiencyFactor / matchedSkills.length) * 100)
      : requiredSkills.length === 0
      ? 85
      : 30;

  const blendedSkillScore = Math.round(
    0.65 * skillCoverageScore + 0.35 * proficiencyScore
  );

  // 2. COMMITMENT & AVAILABILITY MATCH
  let commitmentScore = 85;
  const avail = String(user.availability || "").toLowerCase();

  if (avail.includes("busy")) {
    commitmentScore = 40;
  } else if (avail.includes("full-time") || avail.includes("40")) {
    commitmentScore = 95;
  } else if (avail.includes("available") || avail.includes("open")) {
    commitmentScore = 90;
  } else if (avail.includes("part-time") || avail.includes("weekend")) {
    commitmentScore = 75;
  }

  // 3. EXECUTION RELIABILITY
  let executionReliabilityScore = 88;
  try {
    if (user._id) {
      const userTasks = await Task.find({ assignedTo: user._id });
      if (userTasks.length > 0) {
        const completed = userTasks.filter(
          (t) => t.status === "completed"
        ).length;
        const overdue = userTasks.filter((t) => {
          return (
            t.status !== "completed" && t.dueDate && new Date(t.dueDate) < new Date()
          );
        }).length;

        const baseRate = (completed / userTasks.length) * 100;
        const penalty = (overdue / userTasks.length) * 30;
        executionReliabilityScore = Math.max(20, Math.min(99, Math.round(baseRate - penalty)));
      } else {
        executionReliabilityScore = 85; // Baseline for fresh user
      }
    }
  } catch (err) {
    executionReliabilityScore = 85;
  }

  // 4. COLLABORATION & REPUTATION
  let collaborationScore = 80;
  if (user.reputationScore) {
    collaborationScore = user.reputationScore;
  } else {
    const projectsCount = Number(user.projectsWorked || user.teamsJoined || 0);
    collaborationScore = Math.min(95, 75 + projectsCount * 5);
  }

  // 5. OVERALL WEIGHTED COMPOSITE SCORE
  // Weights:
  // - Skill Match: 40%
  // - Proficiency Alignment: 20%
  // - Commitment Match: 15%
  // - Execution Reliability: 15%
  // - Collaboration: 10%
  const overall = Math.round(
    0.40 * blendedSkillScore +
    0.20 * proficiencyScore +
    0.15 * commitmentScore +
    0.15 * executionReliabilityScore +
    0.10 * collaborationScore
  );

  const finalScore = Math.max(15, Math.min(99, overall));

  return {
    overallScore: finalScore,
    matchedSkills,
    missingSkills,
    breakdown: {
      skillMatch: Math.max(10, Math.min(100, blendedSkillScore)),
      proficiencyMatch: Math.max(10, Math.min(100, proficiencyScore)),
      commitmentMatch: Math.max(10, Math.min(100, commitmentScore)),
      executionReliability: Math.max(10, Math.min(100, executionReliabilityScore)),
      collaboration: Math.max(10, Math.min(100, collaborationScore)),
    },
  };
};

module.exports = {
  calculateCompatibility,
  normalizeSkills,
};

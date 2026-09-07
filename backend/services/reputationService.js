/**
 * Reputation & Execution Analytics Service
 *
 * Drives real execution analytics and dynamic reputation scores
 * from actual MongoDB task and project participation records.
 */

const Task = require("../models/Task");
const User = require("../models/User");
const Team = require("../models/Team");

/**
 * Computes execution metrics for a specific user
 * @param {string} userId
 * @returns {Promise<Object>} Execution metrics & contribution stats
 */
const getUserExecutionAnalytics = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const tasks = await Task.find({ assignedTo: userId }).sort({ createdAt: -1 });

  const tasksAssigned = tasks.length;
  const tasksCompleted = tasks.filter((t) => t.status === "completed").length;
  const tasksPending = tasks.filter((t) => t.status !== "completed").length;

  const now = new Date();
  const overdueTasks = tasks.filter((t) => {
    return (
      t.status !== "completed" && t.dueDate && new Date(t.dueDate) < now
    );
  }).length;

  // Completion rate %
  const completionRate =
    tasksAssigned > 0
      ? Math.round((tasksCompleted / tasksAssigned) * 100)
      : 100;

  // Reliability % penalizes overdue tasks
  const reliability =
    tasksAssigned > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(
              ((tasksCompleted - overdueTasks * 0.5) / tasksAssigned) * 100
            )
          )
        )
      : 88;

  // Count projects worked from teams or user record
  const teamsJoined = user.teamsJoined || 0;
  const projectsWorked = user.projectsWorked || 0;
  const projectsCompleted = Math.max(
    projectsWorked,
    Math.floor(teamsJoined * 0.5)
  );

  // Contribution score (composite 0-100)
  const contributionScore = Math.round(
    0.5 * completionRate + 0.3 * reliability + 0.2 * Math.min(100, tasksCompleted * 10)
  );

  return {
    userId,
    userName: `${user.firstName} ${user.lastName}`,
    tasksAssigned,
    tasksCompleted,
    tasksPending,
    overdueTasks,
    completionRate,
    reliability,
    projectsCompleted,
    contributionScore,
    teamsJoined,
    reputationScore: user.reputationScore || 80,
    reputationBreakdown: user.reputationBreakdown || {
      taskReliability: reliability,
      projectSuccess: 85,
      collaborationScore: 80,
    },
    recentContributions: tasks
      .filter((t) => t.status === "completed")
      .slice(0, 10)
      .map((t) => ({
        taskId: t._id,
        title: t.title,
        skill: t.skill || "General",
        completedAt: t.completedAt || t.updatedAt,
      })),
  };
};

/**
 * Re-evaluates and persists updated reputation score for a user
 * @param {string} userId
 */
const recalculateUserReputation = async (userId) => {
  const analytics = await getUserExecutionAnalytics(userId);

  // Factors:
  // - Task Reliability: 40%
  // - Project Success/Participation: 35%
  // - Consistency / Base: 25%
  const taskReliability = analytics.reliability;
  const projectSuccess = Math.min(100, 75 + analytics.projectsCompleted * 5);
  const collaborationScore = Math.min(100, 70 + analytics.teamsJoined * 6);

  const reputationScore = Math.round(
    0.40 * taskReliability +
    0.35 * projectSuccess +
    0.25 * collaborationScore
  );

  const boundedScore = Math.max(20, Math.min(100, reputationScore));

  await User.findByIdAndUpdate(userId, {
    reputationScore: boundedScore,
    reputationBreakdown: {
      taskReliability,
      projectSuccess,
      collaborationScore,
    },
  });

  return {
    reputationScore: boundedScore,
    breakdown: {
      taskReliability,
      projectSuccess,
      collaborationScore,
    },
  };
};

module.exports = {
  getUserExecutionAnalytics,
  recalculateUserReputation,
};

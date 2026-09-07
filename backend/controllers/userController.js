const User = require("../models/User");
const bcrypt = require("bcryptjs");
const DEFAULT_PROFILE_IMAGE =
    "https://res.cloudinary.com/demo/image/upload/vdefault/default-avatar.png";

// Get My Profile
const getMe = async (req, res) => {
    try {

        const user = await User
            .findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Get Public Profile
const getProfile = async (req, res) => {
    try {

        const user = await User
            .findById(req.params.id)
            .select("firstName lastName skills role createdAt");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Update Profile
const updateProfile = async (req, res) => {
    try {

        const {
            firstName,
            lastName,
            skills,
            mobile,
            github,
            linkedin,
            portfolio,
            bio,
            lookingFor,
            availability,
            experience,
            profileImage
        } = req.body;
        if (firstName !== undefined && firstName.trim() === "") {
            return res.status(400).json({
                message: "Name is required"
            });
        }

        const existingUser = await User.findById(req.user._id);

        if (!existingUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Normalize skills into [{ name, level }]
        let formattedSkills = existingUser.skills;
        if (skills !== undefined) {
          if (Array.isArray(skills)) {
            formattedSkills = skills
              .map((s) => {
                if (typeof s === "string" && s.trim()) {
                  return { name: s.trim(), level: 3 };
                }
                if (s && typeof s === "object" && s.name) {
                  return {
                    name: String(s.name).trim(),
                    level: Math.max(1, Math.min(5, Number(s.level) || 3)),
                  };
                }
                return null;
              })
              .filter(Boolean);
          } else if (typeof skills === "string") {
            formattedSkills = skills
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
              .map((name) => ({ name, level: 3 }));
          }
        }

        const { interests, commitmentHours } = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName: firstName?.trim() || existingUser.firstName,
                lastName: lastName?.trim() || existingUser.lastName,
                mobile: mobile || existingUser.mobile,
                github: github || existingUser.github,
                linkedin: linkedin || existingUser.linkedin,
                portfolio: portfolio || existingUser.portfolio,
                bio: bio || existingUser.bio,

                lookingFor: lookingFor ?? existingUser.lookingFor,
                availability: availability ?? existingUser.availability,
                experience: experience ?? existingUser.experience,
                interests: Array.isArray(interests) ? interests : existingUser.interests,
                commitmentHours: commitmentHours !== undefined ? Number(commitmentHours) : existingUser.commitmentHours,
                profileImage:
                    profileImage === "" || profileImage === null
                        ? null
                        : profileImage || existingUser.profileImage,
                skills: formattedSkills
            },
            { new: true }
        ).select("-password");

        const safeUser = {
            ...updatedUser._doc,
            profileImage:
                updatedUser.profileImage || DEFAULT_PROFILE_IMAGE
        };

        res.status(200).json({
            success: true,
            user: safeUser
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Change Password
const changePassword = async (req, res) => {
    try {

        const { oldPassword, newPassword } = req.body;

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }


        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!oldPassword) {
            return res.status(400).json({
                message: "Old password required"
            });
        }

        const isMatch = await bcrypt.compare(
            oldPassword,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password incorrect"
            });
        }

        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(
            newPassword,
            salt
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Password updated"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const reputationService = require("../services/reputationService");
const Task = require("../models/Task");

// Get Execution Analytics for User (Phase 9 & 10)
const getUserAnalytics = async (req, res) => {
    try {
        const targetUserId = req.params.id || req.user._id;
        const analytics = await reputationService.getUserExecutionAnalytics(targetUserId);

        res.status(200).json({
            success: true,
            data: analytics,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Contribution History for User (Phase 8)
const getUserContributions = async (req, res) => {
    try {
        const targetUserId = req.params.id || req.user._id;
        const tasks = await Task.find({ assignedTo: targetUserId })
            .populate("team", "name project")
            .populate("project", "projectName category")
            .sort({ updatedAt: -1 });

        const totalAssigned = tasks.length;
        const totalCompleted = tasks.filter((t) => t.status === "completed").length;
        const totalPending = tasks.filter((t) => t.status !== "completed").length;
        const completionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 100;

        res.status(200).json({
            success: true,
            data: {
                totalAssigned,
                totalCompleted,
                totalPending,
                completionRate,
                contributions: tasks,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get Skill Graph Visualization Data (Phase 3)
const getUserSkillGraph = async (req, res) => {
    try {
        const targetUserId = req.params.id || req.user._id;
        const user = await User.findById(targetUserId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const skills = (user.skills || []).map((s) => {
            if (typeof s === "string") return { name: s, level: 3 };
            return { name: s.name, level: s.level || 3 };
        });

        // Skill Categories
        const categories = {
            Frontend: ["React", "Vue", "Angular", "HTML", "CSS", "JavaScript", "TypeScript", "Tailwind", "Next.js", "Redux"],
            Backend: ["Node.js", "Express", "Python", "Django", "Flask", "Java", "Spring", "Go", "C#", "PHP"],
            Database: ["MongoDB", "PostgreSQL", "MySQL", "Redis", "Firebase", "SQLite", "Prisma"],
            "Cloud/DevOps": ["AWS", "Docker", "Kubernetes", "CI/CD", "Git", "GitHub", "Linux", "GCP", "Azure"],
            "AI/Data": ["Machine Learning", "NLP", "Python", "TensorFlow", "PyTorch", "Data Analysis", "Pandas", "Scikit-learn"],
        };

        const categorizedSkills = {
            Frontend: [],
            Backend: [],
            Database: [],
            "Cloud/DevOps": [],
            "AI/Data": [],
            Other: [],
        };

        skills.forEach((skill) => {
            let matched = false;
            for (const [cat, names] of Object.entries(categories)) {
                if (names.some((n) => n.toLowerCase() === skill.name.toLowerCase())) {
                    categorizedSkills[cat].push(skill);
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                categorizedSkills.Other.push(skill);
            }
        });

        // Strongest skills (level >= 4)
        const strongestSkills = [...skills].sort((a, b) => b.level - a.level).slice(0, 5);

        res.status(200).json({
            success: true,
            data: {
                skills,
                categorizedSkills,
                strongestSkills,
                totalSkills: skills.length,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getMe,
    getProfile,
    updateProfile,
    changePassword,
    getUserAnalytics,
    getUserContributions,
    getUserSkillGraph,
};


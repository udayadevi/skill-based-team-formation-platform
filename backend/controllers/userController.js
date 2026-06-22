const User = require("../models/User");
const bcrypt = require("bcryptjs");

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
            bio
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

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            {
                firstName: firstName || existingUser.firstName,
                lastName: lastName || existingUser.lastName,
                mobile: mobile || existingUser.mobile,
                github: github || existingUser.github,
                linkedin: linkedin || existingUser.linkedin,
                portfolio: portfolio || existingUser.portfolio,
                bio: bio || existingUser.bio,
                skills: typeof skills === "string"
                    ? skills.split(",").map(s => s.trim())
                    : skills || existingUser.skills
            },
            { new: true }
        ).select("-password");

        res.status(200).json({
            success: true,
            user: updatedUser
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

module.exports = {
    getMe,
    getProfile,
    updateProfile,
    changePassword
};

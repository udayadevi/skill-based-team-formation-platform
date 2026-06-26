import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../services/api";
import "../styles/Profile.css";

import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaUserEdit
} from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    skills: "",
    preferredRole: "",
    availability: "",
    experience: ""
  });

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/me");

      const data = res.data.user;

      setUser(data);

      // ✅ FIX: proper fallback order
      if (data.profileImage && data.profileImage !== "") {
        setProfileImage(data.profileImage);
        localStorage.setItem("profileImage", data.profileImage);
      } else {
        const saved = localStorage.getItem("profileImage");
        if (saved) {
          setProfileImage(saved);
        }
      }

      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        mobile: data.mobile || "",
        bio: data.bio || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        portfolio: data.portfolio || "",
        skills: data.skills?.join(", ") || "",
        preferredRole: data.preferredRole || "",
        availability: data.availability || "Available for New Projects",
        experience: data.experience || ""
      });

    } catch (err) {
      console.log(err);
    }
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64 = reader.result;

        setProfileImage(base64);

        // ✅ IMPORTANT: persist immediately
        localStorage.setItem("profileImage", base64);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/update-profile", {
        ...formData,
        profileImage: profileImage || localStorage.getItem("profileImage"),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
      });

      alert("Profile Updated Successfully");

      setEditMode(false);

      fetchProfile();
    }
    catch (err) {
      console.error(err);
      alert("Unable to Update");
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="profile-loading">
          Loading...
        </div>
      </Layout>
    );
  }

  const FEMALE =
    "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";

  const MALE =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const avatar =
    profileImage ||
    localStorage.getItem("profileImage") ||
    (user.gender === "Female" ? FEMALE : MALE);

  return (
    <Layout>

      <div className="profile-page">

        <div className="profile-grid">

          {/* LEFT PROFILE CARD */}

          <div className="profile-card">
            <div className="profile-img-wrapper">

              <img
                src={avatar}
                alt="profile"
                className="profile-image"
              />

              {/* EDIT ICON BUTTON */}
              <label className="edit-image-icon" title="Change Profile Picture">
                <FaUserEdit />

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  hidden
                />
              </label>

            </div>

            <h2>
              {user.firstName} {user.lastName}
            </h2>

            <p className="profile-role">
              {user.role || "Full Stack Developer"}
            </p>

            <p className="profile-email">
              <FaEnvelope />
              {user.email}
            </p>

            <button
              className="edit-profile-btn"
              onClick={() =>
                setEditMode(!editMode)
              }
            >
              <FaUserEdit />
              {editMode
                ? "Cancel"
                : "Edit Profile"}
            </button>

          </div>

          {/* ABOUT CARD */}

          <div className="about-card">

            <div className="about-header">

              <h2>
                About Me
              </h2>

              {!editMode && (
                <button
                  className="edit-link"
                  onClick={() =>
                    setEditMode(true)
                  }
                >
                  Edit ✏️
                </button>
              )}

            </div>

            {!editMode ? (
              <>

                <p className="about-bio">
                  {user.bio ||
                    "Tell everyone something about yourself..."}
                </p>

                <div className="info-grid">

                  <div className="info-box">
                    <span>Role</span>

                    <h4>
                      {user.role || "-"}
                    </h4>
                  </div>

                  <div className="info-box">
                    <span>
                      Availability
                    </span>

                    <h4 className="available">
                      {user.availability ||
                        "Available for New Projects"}
                    </h4>
                  </div>

                  <div className="info-box">
                    <span>
                      Preferred Role
                    </span>

                    <h4>
                      {user.preferredRole ||
                        "-"}
                    </h4>
                  </div>

                  <div className="info-box">
                    <span>Mobile</span>

                    <h4>
                      <FaPhone />
                      &nbsp;
                      {user.mobile || "-"}
                    </h4>
                  </div>

                  <div className="info-box">
                    <span>
                      Experience
                    </span>

                    <h4>
                      {user.experience ||
                        "-"}
                    </h4>
                  </div>

                  <div className="info-box">
                    <span>Email</span>

                    <h4>
                      {user.email}
                    </h4>
                  </div>

                  <div className="info-box">
                    <span>Gender</span>

                    <h4>
                      {user.gender}
                    </h4>
                  </div>

                  <div className="info-box">
                    <span>Skills</span>

                    <h4>
                      {user.skills?.join(", ") ||
                        "-"}
                    </h4>
                  </div>

                </div>

                <div className="profile-links">

                  {user.github && (
                    <a
                      href={user.github}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaGithub />
                      GitHub
                    </a>
                  )}

                  {user.linkedin && (
                    <a
                      href={user.linkedin}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaLinkedin />
                      LinkedIn
                    </a>
                  )}

                  {user.portfolio && (
                    <a
                      href={user.portfolio}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FaGlobe />
                      Portfolio
                    </a>
                  )}

                </div>

              </>

            ) : (

              <form
                className="edit-profile-form"
                onSubmit={handleUpdate}
              >

                <div className="form-row">

                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />

                </div>

                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                />

                <textarea
                  name="bio"
                  rows="4"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                />

                <div className="form-row">

                  <input
                    type="text"
                    name="preferredRole"
                    placeholder="Preferred Role"
                    value={formData.preferredRole}
                    onChange={handleChange}
                  />

                  <input
                    type="text"
                    name="experience"
                    placeholder="Experience"
                    value={formData.experience}
                    onChange={handleChange}
                  />

                </div>

                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                >
                  <option value="Available for New Projects">
                    Available for New Projects
                  </option>

                  <option value="Open to Work">
                    Open to Work
                  </option>

                  <option value="Busy">
                    Busy
                  </option>

                </select>

                <input
                  type="text"
                  name="github"
                  placeholder="GitHub URL"
                  value={formData.github}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="linkedin"
                  placeholder="LinkedIn URL"
                  value={formData.linkedin}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="portfolio"
                  placeholder="Portfolio URL"
                  value={formData.portfolio}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="skills"
                  placeholder="React, Node, MongoDB..."
                  value={formData.skills}
                  onChange={handleChange}
                />

                <button
                  type="submit"
                  className="save-btn"
                >
                  Save Changes
                </button>

              </form>

            )}

          </div>

        </div>

        {/* SKILLS */}

        <div className="skills-card">

          <div className="section-title">
            <h2>Skills</h2>
          </div>

          <div className="skills-container">

            {user.skills?.length > 0 ? (

              user.skills.map((skill, index) => (

                <span
                  key={index}
                  className="skill-badge"
                >
                  {skill}
                </span>

              ))

            ) : (

              <p>No skills added yet.</p>

            )}

          </div>

        </div>

        {/* MY STATUS */}

        <div className="status-card">

          <div className="section-title">
            <h2>My Status</h2>
          </div>

          <div className="status-grid">

            <div className="status-box">

              <h3>
                {user.teamsJoined || 0}
              </h3>

              <p>Teams Joined</p>

            </div>

            <div className="status-box">

              <h3>
                {user.projectsWorked || 0}
              </h3>

              <p>Projects Worked</p>

            </div>

            <div className="status-box">

              <h3>
                {user.skills?.length || 0}
              </h3>

              <p>Total Skills</p>

            </div>

            <div className="status-box">

              <h3>
                {user.experience || "0"}
              </h3>

              <p>Experience</p>

            </div>

          </div>

        </div>

        {/* WORK EXPERIENCE */}

        <div className="work-card">

          <div className="section-title">
            <h2>Work Experience</h2>
          </div>

          {user.projectExperience &&
            user.projectExperience.length > 0 ? (

            user.projectExperience.map(
              (project, index) => (

                <div
                  className="project-card"
                  key={index}
                >

                  <h3>
                    {project.projectName}
                  </h3>

                  <p>
                    {project.description}
                  </p>

                  <span>
                    Role : {project.role}
                  </span>

                </div>

              )
            )

          ) : (

            <div className="project-card">

              <h3>No Projects Yet</h3>

              <p>
                Your work experience and
                projects will appear here.
              </p>

            </div>

          )}

        </div>
      </div>

    </Layout>
  );
}

export default Profile;
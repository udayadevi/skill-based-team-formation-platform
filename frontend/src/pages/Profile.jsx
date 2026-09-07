import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import api from "../services/api";
import "../styles/Profile.css";
import { useNavigate } from "react-router-dom";
import AuthPrompt from "../components/AuthPrompt";
import { toast } from "react-toastify";

import {
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaUserEdit,
  FaAward,
  FaStar,
  FaPlus
} from "react-icons/fa";
import SkillGraph from "../components/SkillGraph";

function Profile() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imageMenuOpen, setImageMenuOpen] = useState(false);

  const [structuredSkills, setStructuredSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState(3);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    bio: "",
    github: "",
    linkedin: "",
    portfolio: "",
    skills: "",
    lookingFor: "",
    availability: "",
    experience: ""
  });

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const closeMenu = (e) => {
      if (!e.target.closest(".profile-img-wrapper")) {
        setImageMenuOpen(false);
      }
    };

    if (imageMenuOpen) {
      document.addEventListener("click", closeMenu);
    }

    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [imageMenuOpen]);

  const [teamsJoined, setTeamsJoined] = useState(0);
  const [teamsCreated, setTeamsCreated] = useState(0);

  const fetchProfile = async () => {
    try {
      // USER
      const res = await api.get("/users/me");
      const data = res.data.user;

      setUser(data);

      // PROFILE IMAGE
      if (data.profileImage && data.profileImage !== "") {
        setProfileImage(data.profileImage);
        localStorage.setItem("profileImage", data.profileImage);
      } else {
        const saved = localStorage.getItem("profileImage");
        if (saved) {
          setProfileImage(saved);
        }
      }

      // SKILLS
      const rawSkills = data.skills || [];
      const normalized = rawSkills.map((s) =>
        typeof s === "string" ? { name: s, level: 3 } : { name: s.name, level: s.level || 3 }
      );
      setStructuredSkills(normalized);

      // FORM DATA
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        mobile: data.mobile || "",
        bio: data.bio || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        portfolio: data.portfolio || "",
        skills: normalized.map((s) => s.name).join(", "),
        lookingFor: data.lookingFor || "",
        availability: data.availability || "Available for New Projects",
        experience: data.experience || "",
      });

      // TEAM COUNTS
      const teamRes = await api.get("/teams");
      const teams = teamRes.data.data || [];

      const created = teams.filter(
        (t) => t.createdBy?._id === data._id
      );

      const joined = teams.filter(
        (t) =>
          t.members?.some(
            (m) => (typeof m === "string" ? m : m._id) === data._id
          ) &&
          t.createdBy?._id !== data._id
      );

      setTeamsCreated(created.length);
      setTeamsJoined(joined.length);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    if (structuredSkills.some((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase())) {
      toast.info("Skill already in your list");
      return;
    }
    setStructuredSkills([...structuredSkills, { name: newSkillName.trim(), level: Number(newSkillLevel) }]);
    setNewSkillName("");
    setNewSkillLevel(3);
  };

  const handleRemoveSkill = (index) => {
    setStructuredSkills(structuredSkills.filter((_, i) => i !== index));
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
        profileImage: profileImage?.trim() === "" ? null : profileImage,
        skills: structuredSkills
      });

      toast.success("Profile Updated Successfully");

      setTimeout(() => {
        setEditMode(false);
      }, 300);

      fetchProfile();
    }
    catch (err) {
      console.error(err);
      toast.error("Unable to Update");
    }
  };

  if (loading) {
    const token =
      localStorage.getItem("token") ||
      sessionStorage.getItem("token");

    if (!token) {
      return <AuthPrompt />;
    }

    const hasImage = profileImage || user?.profileImage;

    return (
      <>
        <Header />
        <div className="profile-loading">
          Loading...
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />

        <div className="profile-empty">

          <div className="profile-empty-card">

            <div className="profile-empty-icon">
              👤
            </div>

            <h1>Your Profile Awaits</h1>

            <p>
              Login to view your profile,
              manage your skills,
              join teams and collaborate on projects.
            </p>

            <div className="profile-empty-buttons">

              <button
                className="login-btn"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                Register
              </button>

            </div>

          </div>

        </div>
      </>
    );
  }

  const FEMALE =
    "https://cdn-icons-png.flaticon.com/512/4140/4140047.png";

  const MALE =
    "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  const avatar =
    profileImage && profileImage !== ""
      ? profileImage
      : user.profileImage && user.profileImage !== ""
        ? user.profileImage
        : user.gender === "Female"
          ? FEMALE
          : MALE;

  const hasImage = profileImage && profileImage !== "";

  return (
    <>
      <Header />

      <div className="profile-page">

        <div className="profile-grid">

          {/* LEFT PROFILE CARD */}

          <div className="profile-card">
            <div className="profile-img-wrapper">

              <img src={avatar} alt="profile" className="profile-image" />

              <div
                className="edit-image-icon"
                onClick={() => setImageMenuOpen(!imageMenuOpen)}
              >
                <FaUserEdit />
              </div>

              {imageMenuOpen && (
                <div className="image-menu">

                  <label className="menu-item">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageChange}
                    />
                  </label>

                  {profileImage && (
                    <button
                      className="menu-item danger"
                      onClick={async () => {
                        setProfileImage("");
                        localStorage.removeItem("profileImage");

                        await api.put("/users/update-profile", {
                          profileImage: null
                        });

                        setImageMenuOpen(false);
                        fetchProfile();
                      }}
                    >
                      Remove Image
                    </button>
                  )}

                </div>
              )}

            </div>

            <h2>
              {user.firstName} {user.lastName}
            </h2>

            <p className="profile-role">
              {user.role}
            </p>

            <p className="profile-email">
              <FaEnvelope />
              {user.email}
            </p>

            <button
              className="edit-profile-btn"
              onClick={() => setEditMode(!editMode)}
            >
              <FaUserEdit />
              {editMode ? "Cancel" : "Edit Profile"}
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
                  onClick={() => setEditMode(true)}
                >
                  <FaUserEdit />
                  Edit
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
                      Looking For
                    </span>

                    <h4>
                      {user.lookingFor ||
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
                      {(user.skills || []).map((s) =>
                        typeof s === "string" ? s : s.name
                      ).join(", ") || "-"}
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
                    name="lookingFor"
                    placeholder="Looking for"
                    value={formData.lookingFor}
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

                <div className="skill-editor-box">
                  <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#cbd5e1" }}>
                    Manage Your Skills & Proficiency (Levels 1 - 5):
                  </label>
                  <div className="skill-input-row">
                    <input
                      type="text"
                      placeholder="e.g. React, Node.js, Python"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                    />
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                    >
                      <option value={1}>1 - Beginner</option>
                      <option value={2}>2 - Elementary</option>
                      <option value={3}>3 - Intermediate</option>
                      <option value={4}>4 - Advanced</option>
                      <option value={5}>5 - Expert</option>
                    </select>
                    <button
                      type="button"
                      className="add-skill-btn"
                      onClick={handleAddSkill}
                    >
                      <FaPlus /> Add
                    </button>
                  </div>
                  <div className="active-skill-chips">
                    {structuredSkills.length === 0 ? (
                      <p style={{ color: "#94a3b8", fontSize: "0.85rem", margin: 0 }}>No skills added yet. Use the inputs above to add skills.</p>
                    ) : (
                      structuredSkills.map((s, idx) => (
                        <div key={idx} className="editable-skill-chip">
                          <span>{s.name}</span>
                          <span className="chip-level">Lvl {s.level}</span>
                          <button
                            type="button"
                            className="remove-skill-btn"
                            onClick={() => handleRemoveSkill(idx)}
                          >
                            &times;
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

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

        {/* REPUTATION SCORE CARD (PHASE 10) */}
        <div className="reputation-badge-card">
          <div className="reputation-header">
            <h3><FaAward style={{ color: "#f59e0b" }} /> Platform Reputation & Reliability</h3>
            <span className="reputation-score-pill">{user.reputationScore || 80}/100</span>
          </div>
          <div className="reputation-factors">
            <div className="rep-factor">
              <span>Task Reliability</span>
              <strong>{user.reputationBreakdown?.taskReliability || 85}%</strong>
            </div>
            <div className="rep-factor">
              <span>Project Success</span>
              <strong>{user.reputationBreakdown?.projectSuccess || 80}%</strong>
            </div>
            <div className="rep-factor">
              <span>Collaboration Score</span>
              <strong>{user.reputationBreakdown?.collaborationScore || 80}%</strong>
            </div>
          </div>
        </div>

        {/* SKILL GRAPH VISUALIZATION (PHASE 3) */}
        <SkillGraph skills={user.skills} />

        {/* MY STATUS */}

        <div className="status-card">

          <div className="section-title">
            <h2>My Status</h2>
          </div>

          <div className="status-grid">

            <div className="status-box">
              <h3>{teamsCreated}</h3>
              <p>Teams Created</p>
            </div>

            <div className="status-box">

              <h3>{teamsJoined}</h3>
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


    </>
  );
}

export default Profile;
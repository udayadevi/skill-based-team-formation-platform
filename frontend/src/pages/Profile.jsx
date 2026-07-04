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
  FaUserEdit
} from "react-icons/fa";

function Profile() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [imageMenuOpen, setImageMenuOpen] = useState(false);

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

      // FORM DATA
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        mobile: data.mobile || "",
        bio: data.bio || "",
        github: data.github || "",
        linkedin: data.linkedin || "",
        portfolio: data.portfolio || "",
        skills: data.skills?.join(", ") || "",
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
        skills: formData.skills
          ? formData.skills.split(",").map(s => s.trim()).filter(Boolean)
          : []
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
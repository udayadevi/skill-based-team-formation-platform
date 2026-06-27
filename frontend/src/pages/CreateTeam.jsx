import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateTeam.css";
import Header from "../components/Header";

const CreateTeam = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    projectName: "",
    description: "",
    skillsRequired: "",
    maxMembers: 5,
    category: "Web Development",
    deadline: "",
    mode: "Online",
    experience: "Beginner",
    meetingPlatform: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newTeam = {
      id: Date.now(),
      title: formData.name,
      project: formData.projectName,
      leader: "You",
      members: `1 / ${formData.maxMembers}`,
      description: formData.description,
      skills: formData.skillsRequired
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      category: formData.category,
      deadline: formData.deadline,
      mode: formData.mode,
      experience: formData.experience,
      meetingPlatform: formData.meetingPlatform,
    };

    const existingTeams =
      JSON.parse(localStorage.getItem("customTeams")) || [];

    existingTeams.unshift(newTeam);

    localStorage.setItem(
      "customTeams",
      JSON.stringify(existingTeams)
    );
    const existingProjects =
  JSON.parse(localStorage.getItem("customProjects")) || [];

existingProjects.unshift({
  id: newTeam.id,
  title: formData.projectName || formData.name,
  category: formData.category,
  members: `1 / ${formData.maxMembers}`,
  description: formData.description,
  skills: newTeam.skills,
});

localStorage.setItem(
  "customProjects",
  JSON.stringify(existingProjects)
);

    alert("✅ Team Created Successfully!");

    navigate("/find-team");
  };

  return (
    <>
      <Header />
      <div className="create-team-page">
        <h1>🚀 Create Your Team</h1>

      <form className="team-form" onSubmit={handleSubmit}>
        <label>Team Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter team name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Project Name</label>
        <input
          type="text"
          name="projectName"
          placeholder="Enter project name"
          value={formData.projectName}
          onChange={handleChange}
        />

        <label>Project Description</label>
        <textarea
          name="description"
          placeholder="Describe your project..."
          value={formData.description}
          onChange={handleChange}
        />

        <label>Required Skills</label>
        <input
          type="text"
          name="skillsRequired"
          placeholder="React, Node.js, MongoDB"
          value={formData.skillsRequired}
          onChange={handleChange}
        />

        <label>Maximum Members</label>
        <input
          type="number"
          name="maxMembers"
          value={formData.maxMembers}
          onChange={handleChange}
        />

        <label>Project Category</label>

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option>Web Development</option>
          <option>Mobile App</option>
          <option>Artificial Intelligence</option>
          <option>Machine Learning</option>
          <option>Cyber Security</option>
          <option>Cloud Computing</option>
          <option>Data Science</option>
          <option>Other</option>
        </select>

        <label>Project Deadline</label>

        <input
          type="date"
          name="deadline"
          value={formData.deadline}
          onChange={handleChange}
        />

        <label>Mode</label>

        <select
          name="mode"
          value={formData.mode}
          onChange={handleChange}
        >
          <option>Online</option>
          <option>Offline</option>
          <option>Hybrid</option>
        </select>

        <label>Experience Level</label>

        <select
          name="experience"
          value={formData.experience}
          onChange={handleChange}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>

        <label>Meeting Platform</label>

        <input
          type="text"
          name="meetingPlatform"
          placeholder="Discord / Google Meet / Teams"
          value={formData.meetingPlatform}
          onChange={handleChange}
        />

        <button type="submit">
          Create Team
        </button>
      </form>
    </div>
    </>
  );
};

export default CreateTeam;
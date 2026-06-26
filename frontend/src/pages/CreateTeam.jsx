import React from "react";
import "../styles/CreateTeam.css";

const CreateTeam = () => {
  return (
    <div className="create-team-page">

      <h1>🚀 Create Your Team</h1>

      <div className="team-form">

        <label>Team Name</label>
        <input
          type="text"
          placeholder="Enter team name"
        />

        <label>Project Name</label>
        <input
          type="text"
          placeholder="Enter project name"
        />

        <label>Project Description</label>
        <textarea
          placeholder="Describe your project..."
        ></textarea>

        <label>Required Skills</label>
        <input
          type="text"
          placeholder="Example: React, Node.js, MongoDB"
        />

        <label>Maximum Members</label>
        <input
          type="number"
          placeholder="5"
        />

        <label>Project Category</label>

        <select>
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
<input type="date" />

<label>Mode</label>
<select>
  <option>Online</option>
  <option>Offline</option>
  <option>Hybrid</option>
</select>

<label>Experience Level</label>
<select>
  <option>Beginner</option>
  <option>Intermediate</option>
  <option>Advanced</option>
</select>

<label>Meeting Platform</label>
<input
  type="text"
  placeholder="Discord / Google Meet / Microsoft Teams"
/>

        <button>Create Team</button>

      </div>

    </div>
  );
};

export default CreateTeam;
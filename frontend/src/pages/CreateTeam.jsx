import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateTeam.css";
import Layout from "../components/Layout";
import api from "../services/api";
import { toast } from "react-toastify";


const CreateTeam = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    projectName: "",
    description: "",
    skillsRequired: "",
    maxMembers: "",
    category: "Web Development",
    deadline: "",
    mode: "Online",
    experienceLevel: "Beginner",
    meetingPlatform: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");


  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.name.trim()) return "Team name is required";
    if (!form.projectName.trim()) return "Project name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.maxMembers || form.maxMembers < 2)
      return "Minimum 2 members required";
    if (!form.deadline) return "Deadline is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) {
      toast.error(error);
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        projectName: form.projectName,
        description: form.description,
        skillsRequired: form.skillsRequired
          ? form.skillsRequired.split(",").map((s) => s.trim())
          : [],
        maxMembers: Number(form.maxMembers),
        category: form.category,
        deadline: form.deadline,
        mode: form.mode,
        experienceLevel: form.experienceLevel,
        meetingPlatform: form.meetingPlatform,
      };

      await api.post("/teams/create", payload);

      toast.success("Team created successfully 🚀");
      navigate("/dashboard");
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>

      <div className="create-team-page">
        <h1>🚀 Create Your Team</h1>

        <form className="team-form" onSubmit={handleSubmit}>
          <label>Team Name</label>
          <input name="name" value={form.name} onChange={handleChange} />

          <label>Project Name</label>
          <input name="projectName" value={form.projectName} onChange={handleChange} />

          <label>Project Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} />

          <label>Required Skills</label>
          <input
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            placeholder="React, Node, MongoDB"
          />

          <label>Maximum Members</label>
          <input
            type="number"
            name="maxMembers"
            value={form.maxMembers}
            onChange={handleChange}
          />

          <label>Project Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
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
          <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />

          <label>Mode</label>
          <select name="mode" value={form.mode} onChange={handleChange}>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>

          <label>Experience Level</label>
          <select
            name="experienceLevel"
            value={form.experienceLevel}
            onChange={handleChange}
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <label>Meeting Platform</label>
          <input
            name="meetingPlatform"
            value={form.meetingPlatform}
            onChange={handleChange}
            placeholder="Discord / Google Meet"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Team"}
          </button>
        </form>
      </div>
    </Layout>

  );
};

export default CreateTeam;
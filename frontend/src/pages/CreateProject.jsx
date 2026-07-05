import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AuthPrompt from "../components/AuthPrompt";
import api from "../services/api";
import { toast } from "react-toastify";
import "../styles/CreateTeam.css";

const CreateProject = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    category: "Web Development",
    requiredSkills: "",
    experienceLevel: "Beginner",
    mode: "Online",
    deadline: "",
    status: "Open",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.projectName.trim()) return "Project name required";
    if (!form.description.trim()) return "Description required";
    if (!form.category) return "Category required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const payload = {
        projectName: form.projectName,
        description: form.description,
        category: form.category,
        requiredSkills: form.requiredSkills
          ? form.requiredSkills.split(",").map((s) => s.trim())
          : [],
        experienceLevel: form.experienceLevel,
        mode: form.mode,
        status: form.status,
        deadline: form.deadline || null,
      };

      await api.post("/projects", payload);

      toast.success("Project created successfully 🚀");
      navigate("/projects");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <AuthPrompt />;

  return (
    <>
      <Header />

      <div className="create-team-page">
        <h1>📁 Create Project</h1>

        <form className="team-form" onSubmit={handleSubmit}>
          <label>Project Name *</label>
          <input name="projectName" value={form.projectName} onChange={handleChange} />

          <label>Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} />

          <label>Category *</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option>Web Development</option>
            <option>Mobile App</option>
            <option>AI</option>
            <option>ML</option>
          </select>

          <label>Required Skills</label>
          <input
            name="requiredSkills"
            value={form.requiredSkills}
            onChange={handleChange}
            placeholder="React, Node, MongoDB"
          />

          <label>Experience Level</label>
          <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>

          <label>Mode</label>
          <select name="mode" value={form.mode} onChange={handleChange}>
            <option>Online</option>
            <option>Offline</option>
            <option>Hybrid</option>
          </select>

          <label>Deadline</label>
          <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
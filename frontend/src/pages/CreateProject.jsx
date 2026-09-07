import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AuthPrompt from "../components/AuthPrompt";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaPlus, FaTimes } from "react-icons/fa";
import "../styles/CreateTeam.css";

const LEVEL_LABELS = {
  1: "1 - Beginner",
  2: "2 - Elementary",
  3: "3 - Intermediate",
  4: "4 - Advanced",
  5: "5 - Expert",
};

const CreateProject = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    category: "Web Development",
    projectType: "Startup",
    experienceLevel: "Beginner",
    mode: "Online",
    teamSize: 4,
    commitmentRequired: "15-20 hrs/week",
    deadline: "",
    status: "Open",
  });

  const [skillsList, setSkillsList] = useState([
    { name: "React", requiredLevel: 3 },
    { name: "Node.js", requiredLevel: 3 },
  ]);
  const [skillInput, setSkillInput] = useState("");
  const [skillLevelInput, setSkillLevelInput] = useState(3);

  const handleAddSkill = () => {
    if (!skillInput.trim()) return;
    if (skillsList.some((s) => s.name.toLowerCase() === skillInput.trim().toLowerCase())) {
      toast.info("Skill already added to requirement list");
      return;
    }
    setSkillsList([...skillsList, { name: skillInput.trim(), requiredLevel: Number(skillLevelInput) }]);
    setSkillInput("");
    setSkillLevelInput(3);
  };

  const handleRemoveSkill = (idx) => {
    setSkillsList(skillsList.filter((_, i) => i !== idx));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.projectName.trim()) return "Project name is required";
    if (!form.description.trim()) return "Description is required";
    if (!form.category) return "Category is required";
    if (skillsList.length === 0) return "Add at least one required skill";
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
        projectType: form.projectType,
        requiredSkills: skillsList,
        teamSize: Number(form.teamSize) || 4,
        commitmentRequired: form.commitmentRequired,
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
        <h1>📁 Create High-Compatibility Project</h1>
        <p style={{ color: "#94a3b8", marginBottom: "24px" }}>
          Define project requirements and preferred skill levels to match with top collaborators.
        </p>

        <form className="team-form" onSubmit={handleSubmit}>
          <label>Project Name *</label>
          <input
            name="projectName"
            placeholder="e.g. AI Study Assistant"
            value={form.projectName}
            onChange={handleChange}
            required
          />

          <label>Description *</label>
          <textarea
            name="description"
            rows="4"
            placeholder="Describe the goals, tech stack, and execution vision..."
            value={form.description}
            onChange={handleChange}
            required
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>Project Type *</label>
              <select name="projectType" value={form.projectType} onChange={handleChange}>
                <option value="Startup">Startup</option>
                <option value="Hackathon">Hackathon</option>
                <option value="Academic Project">Academic Project</option>
                <option value="Research">Research</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label>Category *</label>
              <select name="category" value={form.category} onChange={handleChange}>
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Cyber Security">Cyber Security</option>
              </select>
            </div>
          </div>

          {/* REQUIRED SKILLS BUILDER (PHASE 4) */}
          <label>Required Skills & Minimum Proficiency Level *</label>
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="Skill name (e.g. React, Node.js, UI/UX)"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddSkill();
                }
              }}
              style={{ flex: 2, minWidth: "150px" }}
            />
            <select
              value={skillLevelInput}
              onChange={(e) => setSkillLevelInput(e.target.value)}
              style={{ flex: 1, minWidth: "130px" }}
            >
              {Object.entries(LEVEL_LABELS).map(([lvl, lbl]) => (
                <option key={lvl} value={lvl}>
                  {lbl}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleAddSkill}
              style={{
                background: "#6366f1",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FaPlus /> Add Skill
            </button>
          </div>

          {/* ACTIVE REQUIRED SKILLS CHIPS */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" }}>
            {skillsList.map((s, idx) => (
              <span
                key={idx}
                style={{
                  background: "rgba(99, 102, 241, 0.2)",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                  color: "#e0e7ff",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "0.88rem",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <strong>{s.name}</strong>
                <small style={{ background: "#6366f1", color: "#fff", padding: "2px 6px", borderRadius: "10px" }}>
                  Lvl {s.requiredLevel}/5
                </small>
                <FaTimes
                  onClick={() => handleRemoveSkill(idx)}
                  style={{ cursor: "pointer", color: "#f87171" }}
                />
              </span>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>Target Team Size</label>
              <input
                type="number"
                name="teamSize"
                min="2"
                max="20"
                value={form.teamSize}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Commitment Required</label>
              <select name="commitmentRequired" value={form.commitmentRequired} onChange={handleChange}>
                <option value="5-10 hrs/week">5-10 hrs/week (Casual)</option>
                <option value="15-20 hrs/week">15-20 hrs/week (Part-time)</option>
                <option value="20-40 hrs/week">20-40 hrs/week (Full-time)</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label>Experience Level</label>
              <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label>Mode</label>
              <select name="mode" value={form.mode} onChange={handleChange}>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <label>Target Deadline</label>
          <input type="date" name="deadline" value={form.deadline} onChange={handleChange} />

          <button type="submit" disabled={loading} style={{ marginTop: "20px" }}>
            {loading ? "Publishing..." : "🚀 Publish Project"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProject;
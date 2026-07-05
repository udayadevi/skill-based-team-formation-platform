import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/CreateTeam.css";
import api from "../services/api";
import { toast } from "react-toastify";
import Header from "../components/Header";
import AuthPrompt from "../components/AuthPrompt";

const CreateTeam = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    name: "",
    project: "",
    description: "",
    skillsRequired: "",
    maxMembers: "",
    category: "Web Development",
    deadline: "",
    mode: "Online",
    experienceLevel: "Beginner",
    meetingPlatform: "",
  });

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  /* ================= LOAD PROJECTS ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.data);
      } catch (err) {
        toast.error("Failed to load projects");
      }
    };

    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!form.name.trim()) return "Team name is required";
    if (!form.project) return "Please select a project";
    if (!form.description.trim()) return "Description is required";
    if (!form.maxMembers || form.maxMembers < 2)
      return "Minimum 2 members required";
    if (!form.deadline) return "Deadline is required";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validate();
    if (error) return toast.error(error);

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        project: form.project,
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
      toast.error(err?.response?.data?.message || "Failed to create team");
    } finally {
      setLoading(false);
    }
  };

  if (!token) return <AuthPrompt />;

  return (
    <>
      <Header />

      <div className="create-team-page">
        <h1>🚀 Create Your Team</h1>

        <form className="team-form" onSubmit={handleSubmit}>
          <label>Team Name *</label>
          <input name="name" value={form.name} onChange={handleChange} />

          {/* ✅ PROJECT DROPDOWN */}
          <label>Select Project *</label>
          <select name="project" value={form.project} onChange={handleChange}>
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.projectName}
              </option>
            ))}
          </select>

          <label>Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />

          <label>Required Skills</label>
          <input
            name="skillsRequired"
            value={form.skillsRequired}
            onChange={handleChange}
            placeholder="React, Node, MongoDB"
          />

          <label>Maximum Members *</label>
          <input
            type="number"
            name="maxMembers"
            value={form.maxMembers}
            onChange={handleChange}
          />

          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            <option>Web Development</option>
            <option>Mobile App</option>
            <option>AI</option>
            <option>ML</option>
          </select>

          <label>Deadline *</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
          />

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
          />

          <button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Team"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateTeam;
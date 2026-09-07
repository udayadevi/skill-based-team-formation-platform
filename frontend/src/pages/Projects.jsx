import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AuthPrompt from "../components/AuthPrompt";
import {
  FaSearch,
  FaUsers,
  FaLaptopCode,
  FaBrain,
  FaMobileAlt,
  FaPlus,
  FaChartLine,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaCompass,
} from "react-icons/fa";
import "../styles/Projects.css";
import api from "../services/api";
import { toast } from "react-toastify";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState("recommended"); // "recommended" or "all"
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [joinTeamId, setJoinTeamId] = useState("");
  const [joinMessage, setJoinMessage] = useState("");
  const [joining, setJoining] = useState(false);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  /* ================= FETCH PROJECTS ================= */
  const fetchProjects = async (tab = activeTab) => {
    try {
      setLoading(true);
      if (tab === "recommended" && token) {
        const res = await api.get("/projects/recommended");
        setProjects(res.data.data || []);
      } else {
        const res = await api.get("/projects");
        setProjects(res.data.data || []);
      }
    } catch (err) {
      console.log(err);
      // Fallback to standard projects if recommended fails
      try {
        const fallback = await api.get("/projects");
        setProjects(fallback.data.data || []);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        setJoinModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal || joinModalOpen ? "hidden" : "auto";
  }, [showModal, joinModalOpen]);

  /* ================= FILTER ================= */
  const filteredProjects = projects.filter((project) => {
    const skillNames = (project.requiredSkills || []).map((s) =>
      typeof s === "string" ? s : s.name
    );
    const text = `${project.projectName} ${project.description} ${skillNames.join(" ")} ${project.projectType || ""}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  /* ================= ICON MAP ================= */
  const getIcon = (category) => {
    switch (category) {
      case "Artificial Intelligence":
        return <FaBrain />;
      case "Mobile App":
        return <FaMobileAlt />;
      default:
        return <FaLaptopCode />;
    }
  };

  const getScoreBadgeClass = (score) => {
    if (!score) return "low";
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  };

  if (!token) return <AuthPrompt />;

  return (
    <>
      <Header />

      <div className="projects-page">
        <div className="projects-header">
          <div>
            <h1>Intelligent Project Matching</h1>
            <p>Form high-compatibility teams backed by real-time skill graphing and execution reliability.</p>
          </div>

          <button
            className="create-project-btn"
            onClick={() => navigate("/create-project")}
          >
            <FaPlus /> &nbsp;Create Project
          </button>
        </div>

        {/* TABS (PHASE 6) */}
        <div className="project-tabs-container">
          <button
            className={`project-tab-btn ${activeTab === "recommended" ? "active" : ""}`}
            onClick={() => setActiveTab("recommended")}
          >
            <FaCompass /> Recommended For You (Compatibility Ranked)
          </button>
          <button
            className={`project-tab-btn ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            <FaUsers /> All Open Projects
          </button>
        </div>

        {/* SEARCH */}
        <div className="filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search by name, category, or required skill (e.g. React, Python)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* PROJECT LIST */}
        <div className="project-grid">
          {loading ? (
            <p style={{ color: "#94a3b8" }}>Calculating compatibility & loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p style={{ color: "#ccc" }}>No matching projects found.</p>
          ) : (
            filteredProjects.map((project) => {
              const score = project.compatibilityScore;
              const matched = project.matchedSkills || [];
              const missing = project.missingSkills || [];
              const skills = project.requiredSkills || [];

              return (
                <div className="project-card" key={project._id}>
                  <div className="project-top">
                    <div className="project-icon">
                      {getIcon(project.category)}
                    </div>

                    <div>
                      <h2>{project.projectName}</h2>
                      <div>
                        <span className="category">{project.category}</span>
                        <span className="type-badge">{project.projectType || "Project"}</span>
                      </div>
                    </div>
                  </div>

                  {/* COMPATIBILITY BADGE (PHASE 5 & 6) */}
                  {score !== undefined && (
                    <div style={{ marginTop: "12px", marginBottom: "8px" }}>
                      <span className={`comp-badge ${getScoreBadgeClass(score)}`}>
                        🎯 {score}% Compatibility Match
                      </span>
                    </div>
                  )}

                  <p className="description">{project.description}</p>

                  {/* MATCHED & MISSING SKILLS PREVIEW (PHASE 6) */}
                  {(matched.length > 0 || missing.length > 0) && (
                    <div className="skills-match-breakdown">
                      {matched.length > 0 && (
                        <div>
                          <strong style={{ color: "#34d399", fontSize: "0.78rem" }}>
                            <FaCheckCircle /> Matched:
                          </strong>{" "}
                          {matched.map((s) => (
                            <span key={s} className="matched-tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {missing.length > 0 && (
                        <div style={{ marginTop: "4px" }}>
                          <strong style={{ color: "#fb7185", fontSize: "0.78rem" }}>
                            <FaTimesCircle /> Missing:
                          </strong>{" "}
                          {missing.map((s) => (
                            <span key={s} className="missing-tag">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* REQUIRED SKILLS */}
                  <div className="skills">
                    {skills.map((skill, index) => {
                      const name = typeof skill === "string" ? skill : skill.name;
                      const lvl = typeof skill === "object" && skill.requiredLevel ? ` (Lvl ${skill.requiredLevel})` : "";
                      return <span key={index}>{name}{lvl}</span>;
                    })}
                  </div>

                  <div className="project-footer">
                    <div className="members">
                      <FaUsers /> &nbsp;Size: {project.teamSize || 4}
                      {project.commitmentRequired && (
                        <span style={{ marginLeft: "10px", color: "#94a3b8" }}>
                          <FaClock /> {project.commitmentRequired}
                        </span>
                      )}
                    </div>

                    <div className="buttons">
                      <button
                        className="view-btn"
                        onClick={() => {
                          setSelectedProject(project);
                          setShowModal(true);
                        }}
                      >
                        Analysis
                      </button>

                      <button
                        className="join-btn"
                        onClick={() =>
                          navigate("/create-team", {
                            state: { projectId: project._id },
                          })
                        }
                      >
                        Create Team
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* COMPATIBILITY BREAKDOWN MODAL (PHASE 5) */}
      {showModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h2 style={{ margin: "0 0 4px 0" }}>{selectedProject.projectName}</h2>
                <span className="type-badge" style={{ marginLeft: 0 }}>
                  {selectedProject.projectType || "Project"} • {selectedProject.category}
                </span>
              </div>
              {selectedProject.compatibilityScore !== undefined && (
                <span className={`comp-badge ${getScoreBadgeClass(selectedProject.compatibilityScore)}`} style={{ fontSize: "1rem" }}>
                  {selectedProject.compatibilityScore}% Compatibility
                </span>
              )}
            </div>

            <p style={{ marginTop: "14px", color: "#cbd5e1" }}>
              {selectedProject.description}
            </p>

            {/* FACTOR BREAKDOWN CARDS */}
            {selectedProject.breakdown && (
              <div className="comp-breakdown-card">
                <h4 style={{ margin: "0 0 14px 0", color: "#e2e8f0", fontSize: "0.95rem" }}>
                  <FaChartLine style={{ color: "#6366f1" }} /> Scoring Factor Breakdown:
                </h4>

                <div className="factor-bar-row">
                  <div className="factor-header">
                    <span>Skill Match & Coverage</span>
                    <strong>{selectedProject.breakdown.skillMatch}%</strong>
                  </div>
                  <div className="factor-track">
                    <div className="factor-fill" style={{ width: `${selectedProject.breakdown.skillMatch}%` }} />
                  </div>
                </div>

                <div className="factor-bar-row">
                  <div className="factor-header">
                    <span>Proficiency Alignment</span>
                    <strong>{selectedProject.breakdown.proficiencyMatch}%</strong>
                  </div>
                  <div className="factor-track">
                    <div className="factor-fill" style={{ width: `${selectedProject.breakdown.proficiencyMatch}%` }} />
                  </div>
                </div>

                <div className="factor-bar-row">
                  <div className="factor-header">
                    <span>Commitment & Availability</span>
                    <strong>{selectedProject.breakdown.commitmentMatch}%</strong>
                  </div>
                  <div className="factor-track">
                    <div className="factor-fill" style={{ width: `${selectedProject.breakdown.commitmentMatch}%` }} />
                  </div>
                </div>

                <div className="factor-bar-row">
                  <div className="factor-header">
                    <span>Execution Reliability</span>
                    <strong>{selectedProject.breakdown.executionReliability}%</strong>
                  </div>
                  <div className="factor-track">
                    <div className="factor-fill" style={{ width: `${selectedProject.breakdown.executionReliability}%` }} />
                  </div>
                </div>

                <div className="factor-bar-row" style={{ marginBottom: 0 }}>
                  <div className="factor-header">
                    <span>Collaboration & Reputation</span>
                    <strong>{selectedProject.breakdown.collaboration}%</strong>
                  </div>
                  <div className="factor-track">
                    <div className="factor-fill" style={{ width: `${selectedProject.breakdown.collaboration}%` }} />
                  </div>
                </div>
              </div>
            )}

            <div style={{ marginTop: "14px" }}>
              <strong style={{ color: "#e2e8f0" }}>Required Skills:</strong>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                {(selectedProject.requiredSkills || []).map((skill, idx) => {
                  const name = typeof skill === "string" ? skill : skill.name;
                  const isMatched = (selectedProject.matchedSkills || []).includes(name);
                  return (
                    <span
                      key={idx}
                      className={isMatched ? "matched-tag" : "missing-tag"}
                    >
                      {isMatched ? "✓ " : "✗ "}
                      {name}
                      {typeof skill === "object" && skill.requiredLevel && ` (Lvl ${skill.requiredLevel})`}
                    </span>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "24px" }}>
              <button
                className="close-btn"
                style={{ flex: 1, marginTop: 0 }}
                onClick={() => setShowModal(false)}
              >
                Close
              </button>

              <button
                className="join-btn"
                style={{ flex: 1 }}
                onClick={() => {
                  setShowModal(false);
                  navigate("/create-team", {
                    state: { projectId: selectedProject._id },
                  });
                }}
              >
                Start Team For Project
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
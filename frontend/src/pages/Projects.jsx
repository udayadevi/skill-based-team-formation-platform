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
} from "react-icons/fa";
import "../styles/Projects.css";
import api from "../services/api";

const Projects = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  /* ================= FETCH PROJECTS ================= */
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setShowModal(false);
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "auto";
  }, [showModal]);

  /* ================= FILTER ================= */
  const filteredProjects = projects.filter((project) => {
    const text = `${project.projectName} ${project.description} ${project.requiredSkills?.join(" ") || ""
      }`.toLowerCase();

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

  if (!token) return <AuthPrompt />;

  return (

    <>
      <Header />

      <div className="projects-page">
        <div className="projects-header">
          <div>
            <h1>Projects</h1>
            <p>Discover and collaborate on real projects.</p>
          </div>

          <button
            className="create-project-btn"
            onClick={() => navigate("/create-project")}
          >
            <FaPlus /> &nbsp;Create Project
          </button>
        </div>

        {/* SEARCH */}
        <div className="filter-bar">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* PROJECT LIST */}
        <div className="project-grid">
          {filteredProjects.length === 0 ? (
            <p style={{ color: "#ccc" }}>No projects found</p>
          ) : (
            filteredProjects.map((project) => (
              <div className="project-card" key={project._id}>
                <div className="project-top">
                  <div className="project-icon">
                    {getIcon(project.category)}
                  </div>

                  <div>
                    <h2>{project.projectName}</h2>
                    <span className="category">{project.category}</span>
                  </div>
                </div>

                <p className="description">{project.description}</p>

                <div className="skills">
                  {project.requiredSkills?.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="project-footer">
                  <div className="members">
                    <FaUsers /> &nbsp;Open Project
                  </div>

                  <div className="buttons">
                    <button
                      className="view-btn"
                      onClick={() => {
                        setSelectedProject(project);
                        setShowModal(true);
                      }}
                    >
                      View
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
            ))
          )}
        </div>
      </div>
      {showModal && selectedProject && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedProject.projectName}</h2>
            <p><strong>Category:</strong> {selectedProject.category}</p>

            <p style={{ marginTop: "10px" }}>
              {selectedProject.description}
            </p>

            <div style={{ marginTop: "10px" }}>
              <strong>Skills:</strong>{" "}
              {(selectedProject.requiredSkills || []).join(", ")}
            </div>

            <button
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaSearch,
  FaUsers,
  FaLaptopCode,
  FaBrain,
  FaMobileAlt,
  FaPlus,
} from "react-icons/fa";
import "../styles/Projects.css";

const projects = [
  {
    id: 1,
    title: "Skill Based Team Formation",
    category: "Web Development",
    members: "4 / 5",
    description:
      "A MERN Stack platform that helps students create teams based on skills.",
    skills: ["React", "Node.js", "MongoDB"],
    icon: <FaLaptopCode />,
  },
  {
    id: 2,
    title: "AI Resume Analyzer",
    category: "Artificial Intelligence",
    members: "3 / 4",
    description:
      "An AI application that analyzes resumes and provides ATS scores.",
    skills: ["Python", "Machine Learning", "Flask"],
    icon: <FaBrain />,
  },
  {
    id: 3,
    title: "Campus Connect",
    category: "Mobile App",
    members: "2 / 5",
    description:
      "A student collaboration app for clubs, events and communication.",
    skills: ["Flutter", "Firebase", "Dart"],
    icon: <FaMobileAlt />,
  },
];

const Projects = () => {
  const navigate = useNavigate();

  return (
    <div className="projects-page">

      <div className="projects-header">

        <div>
          <h1>Projects</h1>
          <p>Discover exciting projects and collaborate with teams.</p>
        </div>

        <button
          className="create-project-btn"
          onClick={() => navigate("/create-team")}
        >
          <FaPlus />
          Create Project
        </button>

      </div>

      <div className="filter-bar">

        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search projects..."
          />
        </div>

        <select>
          <option>All Categories</option>
          <option>Web Development</option>
          <option>Artificial Intelligence</option>
          <option>Mobile App</option>
        </select>

        <select>
          <option>Latest</option>
          <option>Oldest</option>
        </select>

      </div>

      <div className="project-grid">

        {projects.map((project) => (

          <div className="project-card" key={project.id}>

            <div className="project-top">

              <div className="project-icon">
                {project.icon}
              </div>

              <div>
                <h2>{project.title}</h2>
                <span className="category">
                  {project.category}
                </span>
              </div>

            </div>

            <p className="description">
              {project.description}
            </p>

            <div className="skills">

              {project.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}

            </div>

            <div className="project-footer">

              <div className="members">
                <FaUsers />
                {project.members}
              </div>

              <div className="buttons">
                <button className="view-btn">
                  View
                </button>

                <button className="join-btn">
                  Join
                </button>
              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default Projects;
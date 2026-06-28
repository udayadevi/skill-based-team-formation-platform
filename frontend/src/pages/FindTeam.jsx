import React, { useEffect, useState } from "react";
import "../styles/FindTeam.css";
import Header from "../components/Header";
import api from "../services/api";
import AuthPrompt from "../components/AuthPrompt";

const defaultTeams = [
  {
    id: 1,
    title: "React Developer Team",
    project: "Skill Based Team Formation",
    leader: "Lalitha Yelisetti",
    members: "3 / 5",
    description:
      "Building a MERN Stack application for intelligent team formation.",
    skills: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 2,
    title: "AI Resume Analyzer",
    project: "Resume Analyzer",
    leader: "Rohit Kumar",
    members: "2 / 4",
    description:
      "AI project that analyzes resumes using Machine Learning.",
    skills: ["Python", "Flask", "Machine Learning"],
  },
  {
    id: 3,
    title: "E-Commerce Website",
    project: "Online Shopping",
    leader: "Rahul Verma",
    members: "4 / 6",
    description:
      "Full stack ecommerce website with authentication and payments.",
    skills: ["React", "Express", "MongoDB"],
  },
  {
    id: 4,
    title: "Secure Chat App",
    project: "Cyber Security",
    leader: "Anjali Patel",
    members: "3 / 5",
    description:
      "End-to-end encrypted chat application using Socket.io.",
    skills: ["React", "Node.js", "Socket.io"],
  },
];

const FindTeam = () => {
  const [search, setSearch] = useState("");
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/teams");
      const dbTeams = res.data.data || [];

      const combinedTeams = [
        ...defaultTeams.map((t) => ({ ...t, isDefault: true })),
        ...dbTeams.map((t) => ({ ...t, isDefault: false })),
      ];

      setTeams(combinedTeams);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const filteredTeams = teams.filter((team) => {
    const skills = team.isDefault
      ? team.skills || []
      : team.skillsRequired || [];

    const text = `
      ${team.isDefault ? team.title : team.name}
      ${team.isDefault ? team.project : team.projectName}
      ${skills.join(" ")}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const joinTeam = async (team) => {
    try {
      if (team.isDefault) {
        alert("This is a demo team. You cannot join it.");
        return;
      }

      const res = await api.put(`/teams/join/${team._id}`);
      alert(res.data.message);

      fetchTeams(); // refresh from backend
    } catch (err) {
      alert(err.response?.data?.message || "Failed to join team");
    }
  };

  const viewDetails = (team) => {
    const leader = team.isDefault
      ? team.leader
      : team.createdBy
        ? `${team.createdBy.firstName} ${team.createdBy.lastName}`
        : "Unknown";

    const members = team.isDefault
      ? team.members
      : `${team.members.length} / ${team.maxMembers}`;

    const skills = team.isDefault
      ? team.skills || []
      : team.skillsRequired || [];

    const project = team.isDefault ? team.project : team.projectName;

    alert(
      `Project : ${project}

Leader : ${leader}

Members : ${members}

Description :

${team.description}

Skills :

${skills.join(", ")}`
    );
  };

  const token = localStorage.getItem("token");

  if (!token) {
    return <AuthPrompt />;
  }

  return (
    <>
      <Header />
      <div className="findTeamPage">
        <h1>🔍 Find Your Perfect Team</h1>

        <div className="searchSection">
          <input
            type="text"
            placeholder="Search by Team, Project or Skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button>Search</button>
        </div>

        <div className="teamGrid">
          {filteredTeams.map((team) => {
            const skills = team.isDefault
              ? team.skills || []
              : team.skillsRequired || [];

            return (
              <div
                className="teamCard"
                key={team.isDefault ? team.id : team._id}
              >
                <h2>{team.isDefault ? team.title : team.name}</h2>

                <p>
                  <strong>📂 Project:</strong>{" "}
                  {team.isDefault ? team.project : team.projectName}
                </p>

                <p>
                  <strong>👤 Leader:</strong>{" "}
                  {team.isDefault
                    ? team.leader
                    : team.createdBy
                      ? `${team.createdBy.firstName} ${team.createdBy.lastName}`
                      : "Unknown"}
                </p>

                <p>
                  <strong>👥 Members:</strong>{" "}
                  {team.isDefault
                    ? team.members
                    : `${team.members.length} / ${team.maxMembers}`}
                </p>

                <p className="description">
                  {team.description || "No description available"}
                </p>

                <div className="skills">
                  {skills.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>

                <div className="buttons">
                  <button
                    className="detailsBtn"
                    onClick={() => viewDetails(team)}
                  >
                    View Details
                  </button>

                  <button
                    className="joinBtn"
                    onClick={() => joinTeam(team)}
                    disabled={
                      team.isDefault ||
                      (team.members?.length || 0) >= (team.maxMembers || 0)}
                  >
                    {team.isDefault
                      ? "Demo Team"
                      : (team.members?.length || 0) >= (team.maxMembers || 0)
                        ? "Already Filled"
                        : "Join Team"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FindTeam;
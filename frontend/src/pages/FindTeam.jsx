import React, { useState } from "react";
import "../styles/FindTeam.css";

const FindTeam = () => {
  const [search, setSearch] = useState("");

  const teams = [
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

  const filteredTeams = teams.filter((team) =>
    team.skills.join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="findTeamPage">

      <h1>🔍 Find Your Perfect Team</h1>

      <div className="searchSection">
        <input
          type="text"
          placeholder="Search by Skill (React, Java, Python...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button>Search</button>
      </div>

      <div className="teamGrid">

        {filteredTeams.map((team) => (

          <div className="teamCard" key={team.id}>

            <h2>{team.title}</h2>

            <p>
              <strong>📂 Project:</strong> {team.project}
            </p>

            <p>
              <strong>👤 Leader:</strong> {team.leader}
            </p>

            <p>
              <strong>👥 Members:</strong> {team.members}
            </p>

            <p className="description">
              {team.description}
            </p>

            <div className="skills">

              {team.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}

            </div>

            <div className="buttons">

              <button className="detailsBtn">
                View Details
              </button>

              <button className="joinBtn">
                Join Team
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default FindTeam;
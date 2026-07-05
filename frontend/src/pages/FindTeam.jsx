import React, { useEffect, useState } from "react";
import "../styles/FindTeam.css";
import Header from "../components/Header";
import api from "../services/api";
import AuthPrompt from "../components/AuthPrompt";
import TeamDetailsModal from "../components/TeamDetailsModal";
import { toast } from "react-toastify";

const defaultTeams = [
  {
    id: 1,
    title: "React Developer Team",
    project: "Skill Based Team Formation Platform",
    leader: "Lalitha Yelisetti",
    leaderEmail: "lalitha@example.com",

    category: "Web Development",
    mode: "Online",
    experienceLevel: "Intermediate",
    meetingPlatform: "Google Meet",

    createdAt: "2026-06-15",
    deadline: "2026-07-30",

    membersCount: 3,
    maxMembers: 5,
    description:
      "We are building a MERN stack-based intelligent team formation platform that matches users based on skills, experience, and availability.",

    skills: ["React", "Node.js", "MongoDB", "Express", "JWT"]
  },

  {
    id: 2,
    title: "AI Resume Analyzer",
    project: "Smart Resume Screening System",
    leader: "Rohit Kumar",
    leaderEmail: "rohit.kumar@example.com",

    category: "Artificial Intelligence",
    mode: "Online",
    experienceLevel: "Advanced",
    meetingPlatform: "Zoom",

    createdAt: "2026-06-10",
    deadline: "2026-08-01",

    membersCount: 2,
    maxMembers: 4,
    description:
      "An AI-powered system that analyzes resumes and matches candidates with job descriptions using NLP and ML models.",

    skills: ["Python", "Flask", "Machine Learning", "NLP", "Scikit-learn"]
  },

  {
    id: 3,
    title: "E-Commerce Website",
    project: "Full Stack Online Shopping Platform",
    leader: "Rahul Verma",
    leaderEmail: "rahul.verma@example.com",

    category: "Web Development",
    mode: "Hybrid",
    experienceLevel: "Intermediate",
    meetingPlatform: "Google Meet",

    createdAt: "2026-05-20",
    deadline: "2026-07-25",
    membersCount: 4,
    maxMembers: 6,
    description:
      "A full-stack ecommerce platform with product listings, cart system, authentication, and payment integration.",

    skills: ["React", "Node.js", "Express", "MongoDB", "Stripe"]
  },

  {
    id: 4,
    title: "Secure Chat App",
    project: "Encrypted Messaging System",
    leader: "Anjali Patel",
    leaderEmail: "anjali.patel@example.com",

    category: "Cyber Security",
    mode: "Online",
    experienceLevel: "Advanced",
    meetingPlatform: "Discord",

    createdAt: "2026-06-01",
    deadline: "2026-07-20",

    membersCount: 3,
    maxMembers: 5,
    description:
      "A real-time chat application with end-to-end encryption using Socket.io and secure authentication.",

    skills: ["React", "Node.js", "Socket.io", "Encryption", "JWT"]
  }
];

const FindTeam = () => {
  const [search, setSearch] = useState("");
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

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
      ${team.isDefault ? team.project : team.project?.projectName}
      ${skills.join(" ")}
    `.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  const joinTeam = async (team) => {
    try {
      if (team.isDefault) {
        toast.info("This is a demo team.");
        return;
      }

      const res = await api.put(`/teams/join/${team._id}`);

      toast.success(res.data.message);

      setSelectedTeam(null);

      fetchTeams();

    } catch (err) {

      toast.error(
        err.response?.data?.message ||
        "Failed to join team"
      );

    }
  };

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

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

          <button onClick={() => setSearch(search)}>
            Search
          </button>
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
                  {team.isDefault
                    ? team.project
                    : team.project?.projectName}
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
                    ? `${team.membersCount} / ${team.maxMembers}`
                    : `${team.members?.length || 0} / ${team.maxMembers}`}
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
                    onClick={() => setSelectedTeam(team)}
                  >
                    View Details
                  </button>

                  <button
                    className="joinBtn"
                    onClick={() => joinTeam(team)}
                    disabled={
                      team.isDefault
                        ? false
                        : (team.members?.length || 0) >= (team.maxMembers || 0)
                    }
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
      {selectedTeam && (

        <TeamDetailsModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
          onJoin={() => joinTeam(selectedTeam)}
        />

      )}
    </>
  );
};

export default FindTeam;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Dashboard.css";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [activities, setActivities] = useState([]);

  const [teamCount, setTeamCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.get("/users/me");
        setUser(res.data?.user || res.data || {});
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();

    const createdTeams =
      JSON.parse(localStorage.getItem("customTeams")) || [];

    const joinedTeams =
      JSON.parse(localStorage.getItem("joinedTeams")) || [];

    const projects =
      JSON.parse(localStorage.getItem("customProjects")) || [];

    // COUNTS (FIXED)
    setTeamCount(createdTeams.length + joinedTeams.length);
    setProjectCount(projects.length);

    const recent = [];

    // Created Teams
    createdTeams.forEach((team) => {
      recent.push({
        id: `${team.id || team.title}-created-team`,
        text: `Created Team: ${team.title}`,
        time: "Just Now",
      });
    });

    // Joined Teams
    joinedTeams.forEach((team) => {
      recent.push({
        id: `${team.id || team.title}-joined-team`,
        text: `Joined Team: ${team.title}`,
        time: "Just Now",
      });
    });

    // Created Projects (FIXED SOURCE)
    projects.forEach((project) => {
      recent.push({
        id: `${project.id || project.title}-project`,
        text: `Created Project: ${project.name || project.title}`,
        time: "Just Now",
      });
    });

    setActivities(recent);
  }, []);

  const skillCount = Array.isArray(user?.skills)
    ? user.skills.length
    : 0;

  return (
    <Layout>
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1>
            Welcome, {user?.name || user?.firstName || "User"} 👋
          </h1>
          <p>{user?.role || "Skill Based Team Member"}</p>
        </div>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stat-card">
            <h2>Skills</h2>
            <span>{skillCount}</span>
          </div>

          <div className="stat-card">
            <h2>Teams</h2>
            <span>{teamCount}</span>
          </div>

          <div className="stat-card">
            <h2>Projects</h2>
            <span>{projectCount}</span>
          </div>

        </div>

        {/* QUICK ACTIONS */}
        <h2 className="section-title">Quick Actions</h2>

        <div className="action-grid">

          <div className="action-card" onClick={() => navigate("/find-team")}>
            <h3>Teams</h3>
            <p>Create, Join and Manage Teams</p>
          </div>

          <div className="action-card" onClick={() => navigate("/create-team")}>
            <h3>Create Team</h3>
            <p>Create a new team for your project</p>
          </div>

          <div className="action-card" onClick={() => navigate("/projects")}>
            <h3>Projects</h3>
            <p>View and Manage Projects</p>
          </div>

          <div className="action-card" onClick={() => navigate("/profile")}>
            <h3>Profile</h3>
            <p>Update Personal Information</p>
          </div>

        </div>

        {/* RECENT ACTIVITY */}
        <div className="recent-section">
          <h2>Recent Activity</h2>

          <div className="recent-card">
            {activities.length === 0 ? (
              <p>No recent activity yet.</p>
            ) : (
              activities.map((item) => (
                <p key={item.id}>
                  ✅ {item.text} <small>({item.time})</small>
                </p>
              ))
            )}
          </div>
        </div>

      </div>
    </Layout>
  );
}

export default Dashboard;
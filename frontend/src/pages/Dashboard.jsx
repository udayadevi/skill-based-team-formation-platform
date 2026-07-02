import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import API from "../services/api";
import Header from "../components/Header";
import AuthPrompt from "../components/AuthPrompt";

function Dashboard() {
  const navigate = useNavigate();

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  if (!token) {
    return (
      <>
        <Header />
        <AuthPrompt />
      </>
    );
  }

  const [user, setUser] = useState({});
  const [activities, setActivities] = useState([]);

  const [teamCount, setTeamCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userRes = await API.get("/users/me");
        const userData = userRes.data?.user || userRes.data || {};
        setUser(userData);

        const teamRes = await API.get("/teams");
        const teams = teamRes.data?.data || [];

        const createdTeams = teams.filter(
          (t) => t.createdBy?._id === userData._id
        );

        const joinedTeams = teams.filter(
          (t) =>
            t.members?.some(
              (m) => (typeof m === "string" ? m : m._id) === userData._id
            ) && t.createdBy?._id !== userData._id
        );

        setTeamCount(createdTeams.length + joinedTeams.length);

        // projects safe fetch
        let projectCountValue = 0;
        try {
          const projectRes = await API.get("/projects");
          projectCountValue = projectRes.data?.length || 0;
        } catch (err) {
          projectCountValue = 0;
        }

        setProjectCount(projectCountValue);

        // activity
        const recent = [];

        createdTeams.forEach((t) => {
          recent.push({
            id: t._id,
            text: `Created Team: ${t.name}`,
            time: new Date(t.createdAt || Date.now()).toLocaleString(),
          });
        });

        joinedTeams.forEach((t) => {
          recent.push({
            id: t._id + "-join",
            text: `Joined Team: ${t.name}`,
            time: new Date(t.updatedAt || Date.now()).toLocaleString(),
          });
        });

        setActivities(recent.reverse());
      } catch (err) {
        console.log(err);
      }
    };

    fetchAll();
  }, []);
  const skillCount = Array.isArray(user?.skills)
    ? user.skills.length
    : 0;

  return (
    <>
      <Header />
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
    </>
  );
}

export default Dashboard;
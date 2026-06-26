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

setTeamCount(createdTeams.length + joinedTeams.length);
setProjectCount(createdTeams.length);

const recent = [];

createdTeams.forEach((team) => {
  recent.push({
    id: team.id,
    text: `Created Team: ${team.title}`,
    time: "Just Now",
  });
});

joinedTeams.forEach((team) => {
  recent.push({
    id: team.id + 500,
    text: `Joined Team: ${team.title}`,
    time: "Just Now",
  });
});

createdTeams.forEach((team) => {
  recent.push({
    id: team.id + 1000,
    text: `Created Project: ${team.project || team.title}`,
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

        <div className="dashboard-header">
          <h1>
            Welcome, {user?.name || user?.firstName || "User"} 👋
          </h1>

          <p>
            {user?.role || "Skill Based Team Member"}
          </p>
        </div>

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
            <span>{teamCount}</span>
           </div>

        </div>

        <h2 className="section-title">
          Quick Actions
        </h2>

        <div className="action-grid">

          <div
            className="action-card"
            onClick={() => navigate("/find-team")}
          >
            <h3>Teams</h3>
            <p>Create, Join and Manage Teams</p>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/projects")}
          >
            <h3>Projects</h3>
            <p>View and Manage Projects</p>
          </div>

          <div
            className="action-card"
            onClick={() => navigate("/profile")}
          >
            <h3>Profile</h3>
            <p>Update Personal Information</p>
          </div>

        </div>

        <div className="recent-section">

          <h2>Recent Activity</h2>

          <div className="recent-card">

            {activities.length === 0 ? (
              <p>No recent activity yet.</p>
            ) : (
              activities.map((item) => (
                <p key={item.id}>
                  ✅ {item.text}
                  <small> ({item.time})</small>
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
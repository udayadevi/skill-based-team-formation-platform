import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "../styles/Dashboard.css";
import API from "../services/api";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const [activities, setActivities] = useState([]);
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

    setActivities([
      {
        id: 1,
        text: "Fetched data from backend",
        time: new Date().toLocaleString()
      }
    ]);
  }, []);

const skillCount = Array.isArray(user?.skills)
  ? user.skills.length
  : 0;

  return (
    <Layout>
      <div className="dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1>Welcome, {user?.name || user?.firstName || "User"}👋</h1>
          <p>{user?.role || "Skill Based Team Member"}</p>
        </div>

        {/* STATS (MISSING FIXED) */}
        <div className="stats-grid">

          <div className="stat-card">
            <h2>Skills</h2>
            <span>{skillCount}</span>
          </div>

          <div className="stat-card">
            <h2>Teams</h2>
            <span>0</span>
          </div>

          <div className="stat-card">
            <h2>Projects</h2>
            <span>0</span>
          </div>

        </div>

        {/* QUICK ACTIONS (ONLY ONCE) */}
        <h2 className="section-title">Quick Actions</h2>

        <div className="action-grid">

          <div className="action-card" onClick={() => navigate("/teams")}>
            <h3>Teams</h3>
            <p>Create, Join and Manage Teams</p>
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
              <p>No recent activity yet</p>
            ) : (
              activities.map((act) => (
                <p key={act.id}>
                  ✅ {act.text} <small>({act.time})</small>
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
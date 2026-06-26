import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";

function Layout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") ||
    sessionStorage.getItem("user") ||
    "{}"
  );

const handleLogout = () => {
  const savedImage = localStorage.getItem("profileImage");

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  // 🔥 keep profile image safe
  if (savedImage) {
    localStorage.setItem("profileImage", savedImage);
  }

  navigate("/login");
};
  return (
    <div>
      <nav className="navbar">

        <h2
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/dashboard")}
        >
          SkillTeam
        </h2>

        <div className="nav-center">

          <button
            className="nav-link-btn"
            onClick={() => navigate("/home")}
          >
            Home
          </button>

          <button
            className="nav-link-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

        </div>

        <div className="nav-right">

          <div
            className="profile-icon"
            onClick={() => navigate("/profile")}
            title="Profile"
          >
            {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>

      <main>{children}</main>
    </div>
  );
}

export default Layout;
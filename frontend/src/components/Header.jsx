import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  const token =
  localStorage.getItem("token") ||
  sessionStorage.getItem("token");

const user =
  JSON.parse(localStorage.getItem("user")) ||
  JSON.parse(sessionStorage.getItem("user")) ||
  {};

  const initial = user.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : "U";

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");

  navigate("/login");
};

  return (
    <header className="header">

      <div className="logo">
        SkillTeam
      </div>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {token && (
          <Link to="/dashboard">
            Dashboard
          </Link>
        )}
      </div>

      <div className="right-section">

        {token ? (
          <>

            <div
              className="profile-circle"
              onClick={() => navigate("/profile")}
              style={{ cursor: "pointer" }}
            >
              {initial}
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>

          </>
        ) : (

          <button
            className="logout-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

        )}

      </div>

    </header>
  );
};

export default Header;
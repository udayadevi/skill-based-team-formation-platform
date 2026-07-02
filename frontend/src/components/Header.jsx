import React from "react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Header.css";
import logo from "../assets/images/logo.png";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const user = JSON.parse(
    localStorage.getItem("user") ||
    sessionStorage.getItem("user") ||
    "{}"
  );

  const initial = user?.firstName?.charAt(0)?.toUpperCase() || "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="header">
      {/* Left */}
      <div
        className="nav-left"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <img src={logo} alt="logo" />
        <div>
          <h2>SkillBasedTeam</h2>
          <p>Create • Build • Connect</p>
        </div>
      </div>

      {/* Center */}
      <ul className={`nav-middle ${menuOpen ? "show" : ""}`}>
        <li
          className={location.pathname === "/" ? "active" : ""}
          onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }, 300);

            }
            setMenuOpen(false);
          }}
        >
          Home
        </li>
        <li
          onClick={() => {
            navigate("/", { state: { scrollTo: "about" } });
            setMenuOpen(false);
          }}
        >
          About
        </li>
        <li
          onClick={() => {
            navigate("/", { state: { scrollTo: "features" } });
            setMenuOpen(false);
          }}
        >
          Features
        </li>

        <li
          className={location.pathname === "/find-team" ? "active" : ""}
          onClick={() => {
            navigate("/find-team");
            setMenuOpen(false);
          }}
        >
          Find Team
        </li>
        <li
          className={location.pathname === "/create-team" ? "active" : ""}
          onClick={() => {
            navigate("/create-team");
            setMenuOpen(false);
          }}

        >
          Create Team
        </li>
        <li
          className={location.pathname === "/projects" ? "active" : ""}
          onClick={() => {
            navigate("/projects");
            setMenuOpen(false);
          }}
        >
          Projects
        </li>

        <li
          className={location.pathname === "/dashboard" ? "active" : ""}
          onClick={() => {
            navigate("/dashboard");
            setMenuOpen(false);
          }}
        >
          Dashboard
        </li>
      </ul>

      <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>

      {/* Right */}
      <div className="nav-right">
        {token ? (
          <>
            <div
              className="profile-circle"
              onClick={() => navigate("/profile")}
              title="Profile"
            >
              {initial}
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
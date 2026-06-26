import React from "react";
import { useNavigate } from "react-router-dom";

import hero from "../assets/images/hero.png";
import collab from "../assets/images/collabration.png";
import logo from "../assets/images/logo.png";

import skillMatching from "../assets/images/SkillMatching.png";
import smartFiltering from "../assets/images/SmartFiltering.png";
import teamFormation from "../assets/images/TeamFormation.png";

import "../styles/Home.css";
const Home = () => {
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className="home">

      {/* NAVBAR */}
      <nav className="navbar">

        {/* LEFT LOGO */}
        <div className="nav-left">
          <img src={logo} alt="logo" />
          <div>
            <h2>SkillBasedTeam</h2>
            <p className="tagline">Create • Build • Connect</p>
          </div>
        </div>

        {/* MIDDLE NAV */}
        <ul className="nav-middle">
          <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Home
          </li>

          <li
            onClick={() =>
              document
                .getElementById("about")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            About
          </li>

          <li
            onClick={() =>
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Features
          </li>

          <li>Find Team</li>
          <li>Create Team</li>

          {/*  ONLY SHOW IF LOGGED IN */}
          {isLoggedIn && (
            <li onClick={() => navigate("/profile")}>
              Profile
            </li>
          )}
        </ul>

        {/* RIGHT BUTTONS */}
        <div className="nav-right">

          {isLoggedIn ? (
            <>
              <button onClick={() => navigate("/profile")}>
                Profile
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/login");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button onClick={() => navigate("/login")}>
                Login
              </button>

              <button onClick={() => navigate("/register")}>
                Register
              </button>
            </>
          )}

        </div>

      </nav>

      {/* HERO SECTION */}
      <section className="hero">

        <div className="hero-text">
          <h1>Build Better Teams Based on Skills</h1>

          <p>
            SkillBasedTeam helps developers connect, collaborate, and form strong project teams
            using intelligent skill-based matching.
          </p>

          <button onClick={() => navigate("/register")}>
            Get Started
          </button>
        </div>

        <div className="hero-img">
          <img src={hero} alt="hero" />
        </div>

      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="about">

        <h2>About</h2>

        <p>
          SkillBasedTeam is a platform designed to connect developers based on skills.
        </p>
        <p>
          It helps users find the right teammates for their projects easily.
        </p>
        <p>
          The system improves collaboration by matching similar or complementary skills.
        </p>
        <p>
          Users can create teams, join projects, and collaborate in real-time.
        </p>
        <p>
          Our goal is to make teamwork simple and efficient for developers.
        </p>

      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="features">

        <h2>Features</h2>

        <div className="feature-box">

          {/* Skill matching */}
          <div className="card">
            <img src={skillMatching} alt="Skill Matching" />
            <div>
              <h3>Skill Matching</h3>
              <p>Our Smart algorithm matches you with people who have complementary skills</p>
            </div>
          </div>

          {/* 2 */}
          <div className="card">
            <img src={smartFiltering} alt="Smart Filtering" />
            <div>
              <h3>Smart Filtering</h3>
              <p>Find users based on technologies like React, Python, JavaScript.</p>
            </div>
          </div>

          {/* 3 */}
          <div className="card">
            <img src={collab} alt="Team Collaboration" />
            <div>
              <h3>Team Collaboration</h3>
              {/* <p>Work together in real-time on projects efficiently</p> */}
              <p>Get collabrated with teams based on your skills , intersts and project goals</p>
            </div>
          </div>

          {/* 4 */}
          <div className="card">
            <img src={teamFormation} alt="Team Formation" />
            <div>
              <h3>Team Formation</h3>
              <p>Create and join teams based on project requirements.</p>
            </div>
          </div>

        </div>

      </section>

      {/* FOOTER */}
      <footer>
        <p>© 2026 SkillBasedTeam | All Rights Reserved 💻</p>
      </footer>

    </div>
  );
};

export default Home;
import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import hero from "../assets/images/hero.png";
import collab from "../assets/images/collabration.png";

import skillMatching from "../assets/images/SkillMatching.png";
import smartFiltering from "../assets/images/SmartFiltering.png";
import teamFormation from "../assets/images/TeamFormation.png";

import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);

      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <>
      <Header />
      <div className="home">

        {/* HERO SECTION */}
        <section className="hero">

          <div className="hero-text">
            <h1>Build Better Teams Based on Skills</h1>

            <p>
              SkillBasedTeam helps developers connect, collaborate, and form
              strong project teams using intelligent skill-based matching.
            </p>

            <button onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>

          <div className="hero-img">
            <img src={hero} alt="hero" />
          </div>

        </section>

        {/* ABOUT */}
        <section id="about" className="about">

          <h2>About</h2>

          <p>
            SkillBasedTeam is a platform designed to connect developers based on
            skills.
          </p>

          <p>
            It helps users find the right teammates for their projects easily.
          </p>

          <p>
            The system improves collaboration by matching similar or complementary
            skills.
          </p>

          <p>
            Users can create teams, join projects, and collaborate in real-time.
          </p>

          <p>
            Our goal is to make teamwork simple and efficient for developers.
          </p>

        </section>

        {/* FEATURES */}
        <section id="features" className="features">

          <h2>Features</h2>

          <div className="feature-box">

            <div className="card">
              <img src={skillMatching} alt="Skill Matching" />
              <div>
                <h3>Skill Matching</h3>
                <p>
                  Our smart algorithm matches you with people who have
                  complementary skills.
                </p>
              </div>
            </div>

            <div className="card">
              <img src={smartFiltering} alt="Smart Filtering" />
              <div>
                <h3>Smart Filtering</h3>
                <p>
                  Find users based on technologies like React, Python and
                  JavaScript.
                </p>
              </div>
            </div>

            <div className="card">
              <img src={collab} alt="Team Collaboration" />
              <div>
                <h3>Team Collaboration</h3>
                <p>
                  Get collaborated with teams based on your skills, interests and
                  project goals.
                </p>
              </div>
            </div>

            <div className="card">
              <img src={teamFormation} alt="Team Formation" />
              <div>
                <h3>Team Formation</h3>
                <p>
                  Create and join teams based on project requirements.
                </p>
              </div>
            </div>

          </div>

        </section>

        {/* FOOTER */}
        <footer>
          <p>© 2026 SkillBasedTeam | All Rights Reserved 💻</p>
        </footer>

      </div>
    </>
  );
};

export default Home;
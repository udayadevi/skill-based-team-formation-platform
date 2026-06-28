import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AuthPrompt.css";

const AuthPrompt = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-avatar">👤</div>

        <h2>Your Access Awaits</h2>

        <p>
          Login to create teams, find teammates, manage projects and collaborate.
        </p>

        <div className="auth-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
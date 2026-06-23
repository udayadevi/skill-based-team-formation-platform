import React from "react";
import { useNavigate } from "react-router-dom";

function Layout({ children }) {

  const navigate = useNavigate();

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div>

      <nav className="navbar">

        <h2>SkillTeam</h2>

        <div className="nav-right">

          JSON.parse(localStorage.getItem("user") || "{ }");
          <span>
            {user?.firstName || "User"}
          </span>

          <button onClick={handleLogout}>
            Logout
          </button>

        </div>

      </nav>

      <main>

        {children}

      </main>

    </div>

  );
}

export default Layout;
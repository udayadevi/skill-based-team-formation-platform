import { Link, Routes, Route } from "react-router-dom";
import Users from "./Users";
import Register from "./register";
import Login from "./login";
import Dashboard from "./dashboard";
import Profile from "./profile";
import Skills from "./skills";
import Teams from "./team";
import Matching from "./matching";

function App() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Skill Based Team Formation</h1>

      <Link to="/" style={{ margin: "0 10px" }}>
        All Users
      </Link>

      <Link to="/register" style={{ margin: "0 10px" }}>
        Register
      </Link>

      <Link to="/login" style={{ margin: "0 10px" }}>
        Login
      </Link>

      <Link to="/dashboard" style={{ margin: "0 10px" }}>
        Dashboard
      </Link>

      <Link to="/profile" style={{ margin: "0 10px" }}>
        Profile
      </Link>

      <Link to="/skills" style={{ margin: "0 10px" }}>
        Skills
      </Link>

      <Link to="/teams" style={{ margin: "0 10px" }}>
        Teams
      </Link>

      <Link to="/matching" style={{ margin: "0 10px" }}>
        Matching
      </Link>

      <hr />

      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/matching" element={<Matching />} />
      </Routes>
    </div>
  );
}

export default App;
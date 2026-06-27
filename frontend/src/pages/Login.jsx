import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
import { loginUser } from "../services/authService";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import Header from "../components/Header";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const res = await loginUser(form);

    console.log("LOGIN RESPONSE:", res);

    const token = res.token;
    const user = res.user;

    if (!token) {
      toast.error("Token not received from server");
      return;
    }

    if (remember) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));
    }

    console.log("Local Token:", localStorage.getItem("token"));
    console.log("Session Token:", sessionStorage.getItem("token"));

    toast.success("Login Successful 🚀");

    navigate("/dashboard");

  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  return (
  <>
    <Header />

    <div className="login-page">
      <div className="login-card">

        <h1>Welcome Back 👋</h1>
        <p>Login to continue your journey</p>

        <form onSubmit={handleSubmit}>

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>

          </div>
          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>

            <Link to="/forgot-password">
              Forgot password?
            </Link>
          </div>

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="bottom-text">
            Don't have account? <Link to="/register">Register</Link>
          </p>

        </form>

      </div>
    </div>
    </>
  );
}
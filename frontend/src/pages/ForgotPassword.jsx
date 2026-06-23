import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const sendOtp = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/send-otp", { email });

      toast.success(res.data.message);

      sessionStorage.setItem("resetEmail", email);
      navigate("/verify-otp", { state: { email } });
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>

        <form onSubmit={sendOtp}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
          />

          <button type="submit">Send OTP</button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
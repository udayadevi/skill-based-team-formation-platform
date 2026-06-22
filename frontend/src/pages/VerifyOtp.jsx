import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email ||
        sessionStorage.getItem("resetEmail");

    const handleVerify = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/auth/verify-otp", {
                email,
                otp: otp.trim(),
            });

            toast.success(res.data.message);

            navigate("/reset-password");

        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>Verify OTP</h2>

                <form onSubmit={handleVerify}>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button type="submit">Verify</button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOtp;
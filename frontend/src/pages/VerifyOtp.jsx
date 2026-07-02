import React, { useState } from "react";
import api from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

function VerifyOtp() {
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);

    const email =
        location.state?.email ||
        sessionStorage.getItem("resetEmail");

    const handleVerify = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!email) {
            toast.error("Please request a new OTP.");
            navigate("/forgot-password");
            return;
        }

        if (otp.trim().length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);

            const res = await api.post("/auth/verify-otp", {
                email,
                otp: otp.trim(),
            });

            toast.success(res.data.message);

            navigate("/reset-password");

        } catch (err) {
            toast.error(err.response?.data?.message || "Invalid OTP");
        } finally {
            setLoading(false);
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
                        maxLength={6}
                        autoComplete="one-time-code"
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default VerifyOtp;
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { FaCheck, FaTimes, FaUserClock, FaAward, FaBullseye } from "react-icons/fa";
import "../styles/JoinRequestManager.css";

export default function JoinRequestManager({ teamId, onMemberChange }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/joinrequests?teamId=${teamId}`);
      // Filter for pending requests
      const pending = (res.data.data || []).filter((r) => r.status === "pending");
      setRequests(pending);
    } catch (err) {
      console.error("Failed to load requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchRequests();
    }
  }, [teamId]);

  const handleAccept = async (requestId) => {
    try {
      setProcessingId(requestId);
      const res = await api.put(`/joinrequests/${requestId}/accept`);
      toast.success(res.data.message || "Member accepted into team! 🚀");
      fetchRequests();
      if (onMemberChange) onMemberChange();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to accept member");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId) => {
    try {
      setProcessingId(requestId);
      const res = await api.put(`/joinrequests/${requestId}/reject`);
      toast.info(res.data.message || "Request rejected");
      fetchRequests();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="req-manager-loading">Loading applicants...</div>;
  }

  if (requests.length === 0) {
    return null; // Don't take up space if no pending applications
  }

  return (
    <div className="join-request-manager-container">
      <div className="req-manager-header">
        <h4>
          <FaUserClock style={{ color: "#fbbf24" }} /> Pending Team Applications ({requests.length})
        </h4>
        <p>Review applicant skills, reputation, and compatibility scores before admitting to the team</p>
      </div>

      <div className="applicants-list">
        {requests.map((req) => {
          const user = req.userId || {};
          const score = req.compatibilityScore || 0;
          const skills = user.skills || [];

          return (
            <div key={req._id} className="applicant-card">
              <div className="applicant-top">
                <div className="applicant-info">
                  <h5>
                    {user.firstName} {user.lastName}{" "}
                    <small style={{ color: "#94a3b8" }}>({user.role || "Member"})</small>
                  </h5>
                  <p className="applicant-email">{user.email}</p>
                </div>

                <div className="applicant-metrics">
                  <span className="applicant-score-pill">
                    <FaBullseye /> {score}% Match
                  </span>
                  <span className="applicant-rep-pill">
                    <FaAward /> {user.reputationScore || 80}/100 Rep
                  </span>
                </div>
              </div>

              {req.message && (
                <p className="applicant-note">
                  <strong>Note:</strong> "{req.message}"
                </p>
              )}

              {/* SKILLS */}
              <div className="applicant-skills">
                {skills.map((s, idx) => {
                  const name = typeof s === "string" ? s : s.name;
                  const lvl = typeof s === "object" && s.level ? ` (Lvl ${s.level})` : "";
                  return (
                    <span key={idx} className="applicant-skill-tag">
                      {name}{lvl}
                    </span>
                  );
                })}
              </div>

              {/* ACTIONS */}
              <div className="applicant-actions">
                <button
                  className="accept-btn"
                  disabled={processingId === req._id}
                  onClick={() => handleAccept(req._id)}
                >
                  <FaCheck /> {processingId === req._id ? "Accepting..." : "Accept to Team"}
                </button>

                <button
                  className="reject-btn"
                  disabled={processingId === req._id}
                  onClick={() => handleReject(req._id)}
                >
                  <FaTimes /> Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

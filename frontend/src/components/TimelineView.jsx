import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/TimelineView.css";
import {
  FaRocket,
  FaUserPlus,
  FaUserMinus,
  FaTasks,
  FaCheckCircle,
  FaTrophy,
  FaCommentDots,
} from "react-icons/fa";

const EVENT_ICONS = {
  team_created: <FaRocket className="event-icon created" />,
  member_joined: <FaUserPlus className="event-icon joined" />,
  member_left: <FaUserMinus className="event-icon left" />,
  task_assigned: <FaTasks className="event-icon assigned" />,
  task_completed: <FaCheckCircle className="event-icon completed" />,
  milestone_completed: <FaTrophy className="event-icon milestone" />,
  feedback_given: <FaCommentDots className="event-icon feedback" />,
};

export default function TimelineView({ teamId, projectId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const endpoint = teamId
        ? `/timeline/team/${teamId}`
        : `/timeline/project/${projectId}`;
      const res = await api.get(endpoint);
      setEvents(res.data.data || []);
    } catch (err) {
      console.error("Failed to load timeline:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId || projectId) {
      fetchTimeline();
    }
  }, [teamId, projectId]);

  if (loading) {
    return <div className="timeline-loading">Loading collaboration timeline...</div>;
  }

  if (events.length === 0) {
    return (
      <div className="timeline-empty">
        <p>No timeline activity logged yet. Events will appear as team members join and complete tasks.</p>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      <div className="timeline-header">
        <h4>⏱️ Collaboration Timeline & Milestone Activity</h4>
        <span className="event-count-badge">{events.length} Events</span>
      </div>

      <div className="timeline-feed">
        {events.map((event) => {
          const icon = EVENT_ICONS[event.type] || <FaRocket className="event-icon default" />;
          const time = new Date(event.createdAt || event.timestamp).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div key={event._id} className="timeline-item">
              <div className="timeline-marker">
                <div className="icon-wrapper">{icon}</div>
                <div className="line" />
              </div>

              <div className="timeline-content">
                <div className="item-top">
                  <span className="item-title">{event.title}</span>
                  <span className="item-time">{time}</span>
                </div>
                {event.description && (
                  <p className="item-desc">{event.description}</p>
                )}
                {event.user && (
                  <div className="item-actor">
                    <span>
                      Actor: {event.user.firstName} {event.user.lastName} ({event.user.role || "Member"})
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

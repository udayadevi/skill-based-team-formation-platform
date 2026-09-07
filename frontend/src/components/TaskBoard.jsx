import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/TaskBoard.css";
import { toast } from "react-toastify";
import {
  FaCheckCircle,
  FaClock,
  FaPlus,
  FaTasks,
  FaUserCheck,
  FaExclamationCircle,
} from "react-icons/fa";

export default function TaskBoard({ teamId, members = [], isCreator = false, onUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // New task form state
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [skill, setSkill] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tasks/team/${teamId}`);
      setTasks(res.data.data || []);
    } catch (err) {
      console.error("Failed to load tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) {
      fetchTasks();
    }
  }, [teamId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Task title required");
    if (!assignedTo && members.length > 0) {
      return toast.error("Select a team member to assign");
    }

    try {
      setSubmitting(true);
      await api.post("/tasks", {
        title,
        description,
        teamId,
        assignedTo: assignedTo || members[0]?._id,
        priority,
        skill,
        dueDate: dueDate || null,
      });

      toast.success("Task assigned successfully 📋");
      setTitle("");
      setDescription("");
      setSkill("");
      setDueDate("");
      setShowAssignForm(false);
      fetchTasks();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to assign task");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status: newStatus });
      toast.success(`Task marked as ${newStatus} 🚀`);
      fetchTasks();
      if (onUpdate) onUpdate();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update task");
    }
  };

  const totalAssigned = tasks.length;
  const totalCompleted = tasks.filter((t) => t.status === "completed").length;
  const totalPending = tasks.filter((t) => t.status !== "completed").length;
  const completionRate =
    totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

  return (
    <div className="taskboard-container">
      <div className="taskboard-header">
        <div>
          <h4>📋 Team Task Board & Contributions</h4>
          <p>Real-time execution tracking, task completion rates, and reliability metrics</p>
        </div>

        {isCreator && (
          <button
            className="assign-task-toggle-btn"
            onClick={() => setShowAssignForm(!showAssignForm)}
          >
            <FaPlus /> {showAssignForm ? "Cancel" : "Assign Task"}
          </button>
        )}
      </div>

      {/* EXECUTION STATS SUMMARY (PHASE 8 & 9) */}
      <div className="task-stats-bar">
        <div className="stat-pill">
          <span>Assigned</span>
          <strong>{totalAssigned}</strong>
        </div>
        <div className="stat-pill">
          <span>Completed</span>
          <strong style={{ color: "#34d399" }}>{totalCompleted}</strong>
        </div>
        <div className="stat-pill">
          <span>Pending</span>
          <strong style={{ color: "#fbbf24" }}>{totalPending}</strong>
        </div>
        <div className="stat-pill">
          <span>Completion Rate</span>
          <strong style={{ color: "#818cf8" }}>{completionRate}%</strong>
        </div>
      </div>

      {/* ASSIGN TASK FORM */}
      {showAssignForm && (
        <form className="assign-task-form" onSubmit={handleCreateTask}>
          <h5>Assign New Task to Team Member</h5>
          <div className="form-grid">
            <input
              type="text"
              placeholder="Task Title (e.g. Implement Auth Routes)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              required
            >
              <option value="">Select Assignee *</option>
              {members.map((m) => (
                <option key={m._id || m.id} value={m._id || m.id}>
                  {m.firstName} {m.lastName} ({m.email})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Associated Skill (e.g. React, Node.js)"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
            />

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              title="Due Date"
            />
          </div>

          <textarea
            placeholder="Task description and deliverables..."
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button type="submit" disabled={submitting} className="submit-task-btn">
            {submitting ? "Assigning..." : "Assign Task"}
          </button>
        </form>
      )}

      {/* TASKS LIST */}
      <div className="tasks-list">
        {loading ? (
          <p style={{ color: "#94a3b8" }}>Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="tasks-empty">
            <p>No tasks assigned yet. Assign tasks to track execution analytics and member contributions.</p>
          </div>
        ) : (
          tasks.map((task) => {
            const isDone = task.status === "completed";
            const assigneeName = task.assignedTo
              ? `${task.assignedTo.firstName} ${task.assignedTo.lastName}`
              : "Unassigned";

            return (
              <div key={task._id} className={`task-card ${task.status}`}>
                <div className="task-card-left">
                  <span className={`status-badge ${task.status}`}>
                    {isDone ? <FaCheckCircle /> : <FaClock />} {task.status.replace("_", " ")}
                  </span>
                  <div>
                    <h5 className="task-title">{task.title}</h5>
                    {task.description && <p className="task-desc">{task.description}</p>}
                    <div className="task-meta">
                      <span>👤 Assigned: {assigneeName}</span>
                      {task.skill && <span className="task-skill-tag">🏷️ {task.skill}</span>}
                      <span className={`task-priority ${task.priority.toLowerCase()}`}>
                        ⚡ {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="task-card-actions">
                  {!isDone ? (
                    <button
                      className="complete-task-btn"
                      onClick={() => handleUpdateStatus(task._id, "completed")}
                    >
                      <FaCheckCircle /> Mark Done
                    </button>
                  ) : (
                    <button
                      className="reopen-task-btn"
                      onClick={() => handleUpdateStatus(task._id, "pending")}
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

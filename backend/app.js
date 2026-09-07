const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const joinRequestRoutes = require("./routes/joinRequestRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const timelineRoutes = require("./routes/timelineRoutes");

const app = express();

// Database connection
connectDB();

// CORS configuration (Render Backend + Vercel Frontend Ready)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000",
];

if (process.env.FRONTEND_URL) {
  const customOrigins = process.env.FRONTEND_URL.split(",").map((o) =>
    o.trim().replace(/\/$/, "")
  );
  allowedOrigins.push(...customOrigins);
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, postman, server-to-server)
      if (!origin) return callback(null, true);

      // Allow listed origins
      if (allowedOrigins.includes(origin)) return callback(null, true);

      // Allow any Vercel preview / production deployment domains
      if (/\.vercel\.app$/.test(origin)) return callback(null, true);

      // Fallback for development flexibility
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/joinrequests", joinRequestRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/timeline", timelineRoutes);

// Health check route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Skill-Based Team Formation Platform API Running 🚀",
    version: "2.0.0",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
      teams: "/api/teams",
      projects: "/api/projects",
      joinrequests: "/api/joinrequests",
      tasks: "/api/tasks",
      timeline: "/api/timeline",
    },
  });
});

// 404 Handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Centralized Error Handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
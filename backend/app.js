const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");

// 👇 FIRST load .env
dotenv.config();

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const teamRoutes = require("./routes/teamRoutes");
const joinRequestRoutes = require("./routes/joinRequestRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();

// Database connection
connectDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/joinrequests", joinRequestRoutes);
app.use("/api/projects", projectRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Backend Running Successfully 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
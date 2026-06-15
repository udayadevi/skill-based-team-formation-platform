const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userroutes");
const teamRoutes = require("./routes/teamRoutes");
const joinRequestRoutes = require("./routes/joinRequestRoutes");

dotenv.config();

const app = express();

connectDB();

// VERY IMPORTANT - put this BEFORE routes
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/joinrequests", joinRequestRoutes);

app.get("/", (req, res) => {
  res.send("Backend Running Successfully");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
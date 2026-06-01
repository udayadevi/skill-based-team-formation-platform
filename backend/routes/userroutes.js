const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  res.json({
    message: "Register Route Working",
  });
});

router.post("/login", (req, res) => {
  res.json({
    message: "Login Route Working",
  });
});

router.get("/", (req, res) => {
  res.json({
    message: "Get Users Route Working",
  });
});

module.exports = router;
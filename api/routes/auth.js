const express = require("express");

const router = express.Router();

router.get("/login", function (req, res, next) {
  res.send("Hello World");
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate credentials (example logic)
  if (username === "admin" && password === "password") {
    return res.status(200).json({ message: "Login successful!" });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Example registration logic
  if (username && password) {
    return res.status(201).json({ message: "User registered successfully!" });
  }
  return res.status(400).json({ message: "Invalid data provided" });
});

module.exports = router;

// const app = require("./app");
// const PORT = process.env.PORT || 3001;
// const server = http.createServer(app);
// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend's URL
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./register.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Listen on port 3001
app.listen(3002, () => {
  console.log("Server is running on http://localhost:3002");
});

// Register route
app.post("/register", (req, res) => {
  const sql =
    "INSERT INTO REGISTER (full_name, email, password, confirm_password, role) VALUES (?, ?, ?, ?, ?)";
  const values = [
    req.body.full_name,
    req.body.email,
    req.body.password,
    req.body.confirm_password,
    req.body.role,
  ];

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({
      message: "User registered successfully",
      id: this.lastID,
    });
  });
});

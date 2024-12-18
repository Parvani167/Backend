const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import CORS
const db = require("./db");

const authRoutes = require("./api/routes/auth");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.get("/", function (req, res, next) {
  res.send("Hello World");
});

app.use("/api/auth", authRoutes);

// Error Handling
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;

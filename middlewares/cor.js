const cors = require("cors");

const corsMiddleware = cors({
  origin: "http://localhost:3000", // Your frontend's URL
  methods: ["GET", "POST"],
});

module.exports = corsMiddleware;

// const express = require("express");
// const corsMiddleware = require("./middlewares/cors");
// const authRoutes = require("./routes/auth");

// const app = express();

// // CORS setup
// app.use(corsMiddleware);

// // Middleware to parse JSON
// app.use(express.json());

// // Use authentication routes
// app.use("/api/auth", authRoutes);

// // Start the server
// app.listen(3002, () => {
//   console.log("Server is running on http://localhost:3002");
// });

const http = require("http");
const app = require("./app");
const PORT = process.env.PORT || 3002;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log("Port is running on ", PORT);
});

const express = require("express");
const bcrypt = require("bcryptjs");
const { createUser, readUserByEmail } = require("../../db");
const read = require("body-parser/lib/read");
const jwt = require("jsonwebtoken");
const router = express.Router();
const fs = require("fs");

const privatekey = fs.readFileSync("./key/private.key");

router.get("/", (req, res) => {
  res.send("Auth Module");
});

// Register route
router.post("/register", async (req, res) => {
  const { full_name, email, password, confirm_password, role } = req.body;

  // Check if passwords match
  if (password !== confirm_password) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  //   readUserByEmail(email, (err) => {
  //     if (err) {
  //     } else {
  //       return res.status(409).json({ error: "Email already exists" });
  //     }
  //   });

  //   console.log(users);

  try {
    const hashedPassword = bcrypt.hashSync(password);
    const userData = {
      full_name: full_name,
      email: email,
      password: hashedPassword,
      role: role,
    };
    createUser(userData, (err, result) => {
      if (err) {
        if (
          err.message ==
          "Failed to create case: SQLITE_CONSTRAINT: UNIQUE constraint failed: Users.email"
        ) {
          return res.status(409).json({ message: "Email already exists" });
        } else {
          console.error("Error:", err.message);
          return res.status(err.status).json({ error: err.message });
        }
      } else {
        console.log("Success:", result.message, "New ID:", result.id);
        return res.status(201).json({ message: "User created successfully" });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error registering user" });
  }
});

// Login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate the email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    // Fetch user by email
    readUserByEmail(email, (err, result) => {
      if (err) {
        return res.status(401).json({ error: "Unauthorized User" });
      }

      if (!result || !result.data) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = result.data;

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          return res.status(500).json({ error: "Error comparing passwords" });
        }

        if (!isMatch) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ email: email }, privatekey);

        // Successful login
        return res
          .status(200)
          .json({ message: "Login successful", user: user, token: token });
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Server error" });
  }
});

//logout route
router.post("/logout", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  decoded = jwt.verify(token, privatekey);
  console.log(decoded);
  try {
    // Typically, we just tell the client to remove the token
    res.status(200).json({ email: decoded.email });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error logging out" });
  }
});

module.exports = router;

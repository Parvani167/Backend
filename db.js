const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./casemanagement.db", (err) => {
  if (err) {
    console.error("Failed to connect to database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      `
      CREATE TABLE IF NOT EXISTS Users (
        full_name TEXT,
        email TEXT PRIMARY KEY,
        password TEXT,
        role TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating user:", err.message);
        } else {
          console.log("Table USERS is ready.");
        }
      }
    );
  }
});

// Create a new case
const createUser = (userData, callback) => {
  const { full_name, email, password, role } = userData;
  const sql = `INSERT INTO Users (full_name, email, password, role) VALUES (?, ?, ?, ?)`;
  db.run(sql, [full_name, email, password, role], function (err) {
    if (err) {
      callback({
        status: 500,
        message: "Failed to create case: " + err.message,
      });
    } else {
      callback(null, {
        status: 201,
        message: "Case created successfully",
        id: this.lastID,
      });
    }
  });
};

// Read all cases
const readItems = (callback) => {
  const sql = `SELECT * FROM Users`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      callback({
        status: 500,
        message: "Failed to fetch cases: " + err.message,
      });
    } else {
      callback(null, { status: 200, data: rows });
    }
  });
};

// Read a user by email
const readUserByEmail = (email, callback) => {
  const sql = `SELECT * FROM Users WHERE email = ?`;
  db.get(sql, [email], (err, row) => {
    if (err) {
      callback({
        status: 500,
        message: "Failed to fetch case: " + err.message,
      });
    } else if (!row) {
      callback({ status: 404, message: "User not found" });
    } else {
      callback(null, { status: 200, data: row });
    }
  });
};

// Update a case by ID
const updateItem = (id, caseData, callback) => {
  const { full_name, email, password, role } = caseData;
  const sql = `
    UPDATE Users
    SET full_name = ?, email = ?, password = ?, role = ?
    WHERE id = ?
  `;
  db.run(sql, [full_name, email, password, role, id], function (err) {
    if (err) {
      callback({
        status: 500,
        message: "Failed to update case: " + err.message,
      });
    } else if (this.changes === 0) {
      callback({ status: 404, message: "Case not found or no changes made" });
    } else {
      callback(null, { status: 200, message: "Case updated successfully" });
    }
  });
};

// Delete a case by ID
const deleteItem = (id, callback) => {
  const sql = `DELETE FROM Users WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      callback({
        status: 500,
        message: "Failed to delete case: " + err.message,
      });
    } else if (this.changes === 0) {
      callback({ status: 404, message: "Case not found" });
    } else {
      callback(null, { status: 200, message: "Case deleted successfully" });
    }
  });
};

// Close the database connection on exit
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database connection closed.");
    }
    process.exit(0);
  });
});

// Export the CRUD functions
module.exports = {
  createUser,
  readItems,
  readUserByEmail,
  updateItem,
  deleteItem,
};

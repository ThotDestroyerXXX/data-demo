import sqlite3 from "sqlite3";
import path from "path";

// Get the path to the database relative to the project root
const dbPath = path.resolve(__dirname, "../../../db/demo.db");

// Create database connection
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error("Error connecting to database:", err.message);
  } else {
    console.log("Connected to SQLite database at:", dbPath);
  }
});

export default db;

const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Get directory paths
const rootDir = path.resolve(__dirname);
const viewDataPath = path.join(rootDir, "data", "viewData.json");
const dbPath = path.join(rootDir, "demo.db");

console.log("Running seed script...");
console.log(`Looking for data at: ${viewDataPath}`);
console.log(`Database path: ${dbPath}`);

// Import the JSON data
let viewData;
try {
  const rawData = fs.readFileSync(viewDataPath, "utf-8");
  viewData = JSON.parse(rawData);
  console.log(
    `Loaded data: ${viewData.data.length} transactions, ${viewData.status.length} status records`
  );
} catch (error) {
  console.error("Error loading viewData.json:", error);
  process.exit(1);
}

// Open the database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
    process.exit(1);
  }
  console.log(`Connected to the SQLite database at ${dbPath}`);

  // Run the database initialization
  initDB();
});

function initDB() {
  // Create tables if they don't exist
  db.serialize(() => {
    // Create status table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS status (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating status table:", err);
        }
      }
    );

    // Create transactions table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS data (
        id INTEGER PRIMARY KEY,
        productID TEXT NOT NULL,
        productName TEXT NOT NULL,
        amount TEXT NOT NULL,
        customerName TEXT NOT NULL,
        status INTEGER NOT NULL,
        transactionDate TEXT NOT NULL,
        createBy TEXT NOT NULL,
        createOn TEXT NOT NULL,
        FOREIGN KEY (status) REFERENCES status(id)
      )
    `,
      (err) => {
        if (err) {
          console.error("Error creating transactions table:", err);
        }
      }
    );

    // Insert status data
    const statusStmt = db.prepare(
      "INSERT OR REPLACE INTO status (id, name) VALUES (?, ?)"
    );
    viewData.status.forEach((status) => {
      statusStmt.run(status.id, status.name);
    });
    statusStmt.finalize();
    console.log("Status data inserted successfully");

    // Insert transaction data
    const transactionStmt = db.prepare(`
      INSERT OR REPLACE INTO data (
        id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    viewData.data.forEach((transaction) => {
      transactionStmt.run(
        transaction.id,
        transaction.productID,
        transaction.productName,
        transaction.amount,
        transaction.customerName,
        transaction.status,
        transaction.transactionDate,
        transaction.createBy,
        transaction.createOn
      );
    });
    transactionStmt.finalize();
    console.log("Transaction data inserted successfully");

    // Close the database when done
    db.close((err) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("Database connection closed.");
      }
    });
  });
}

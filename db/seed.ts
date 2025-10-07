// seed json data in data/viewData.json to the database using node
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

// Define types for TypeScript
interface Transaction {
  id: number;
  productID: string;
  productName: string;
  amount: string;
  customerName: string;
  status: number;
  transactionDate: string;
  createBy: string;
  createOn: string;
}

interface Status {
  id: number;
  name: string;
}

interface ViewData {
  data: Transaction[];
  status: Status[];
}

// Get directory paths - use the src directory rather than dist
const rootDir = path.resolve(__dirname, "..");
const viewDataPath = path.join(rootDir, "data", "viewData.json");
const dbPath = path.join(rootDir, "demo.db");

// Import the JSON data
let viewData: ViewData;
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
const db = new sqlite3.Database(dbPath, (err: Error | null) => {
  if (err) {
    console.error("Error opening database:", err.message);
    process.exit(1);
  }
  console.log(`Connected to the SQLite database at ${dbPath}`);

  // Run the database initialization
  initDB();
});

function initDB(): void {
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
      (err: Error | null) => {
        if (err) {
          console.error("Error creating status table:", err);
          return;
        }
      }
    );

    // Create transactions table
    db.run(
      `
      CREATE TABLE IF NOT EXISTS transactions (
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
      (err: Error | null) => {
        if (err) {
          console.error("Error creating transactions table:", err);
          return;
        }
      }
    );

    // Insert status data
    const statusStmt = db.prepare(
      "INSERT OR REPLACE INTO status (id, name) VALUES (?, ?)"
    );
    viewData.status.forEach((status: Status) => {
      statusStmt.run(status.id, status.name);
    });
    statusStmt.finalize();
    console.log("Status data inserted successfully");

    // Insert transaction data
    const transactionStmt = db.prepare(`
      INSERT OR REPLACE INTO transactions (
        id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    viewData.data.forEach((transaction: Transaction) => {
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
    db.close((err: Error | null) => {
      if (err) {
        console.error("Error closing database:", err.message);
      } else {
        console.log("Database connection closed.");
      }
    });
  });
}

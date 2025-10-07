# Data Demo Database

This directory contains the SQLite database and seed scripts for the Data Demo project.

## Tech Stack

- **SQLite**: Lightweight, file-based relational database
- **Node.js**: JavaScript runtime for seed scripts
- **TypeScript**: Type-safe JavaScript (optional for seeding)

## Database Structure

The main database file is `demo.db`, which contains the following tables:

- **data**: Transaction records
- **status**: Transaction status options

### Schema

#### Data Table

```sql
CREATE TABLE data (
  id INTEGER PRIMARY KEY,
  productID TEXT,
  productName TEXT,
  amount TEXT,
  customerName TEXT,
  status INTEGER,
  transactionDate TEXT,
  createBy TEXT,
  createOn TEXT
);
```

#### Status Table

```sql
CREATE TABLE status (
  id INTEGER PRIMARY KEY,
  name TEXT
);
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager

### Installation

```bash
pnpm install
```

### Seeding the Database

The `seed.js` or `seed.ts` script populates the database with initial data:

Using JavaScript:

```bash
node seed.js
```

Using TypeScript:

```bash
npx ts-node seed.ts
```

## Sample Data

The seed script creates:

1. Transaction records with various products, amounts, and statuses
2. Status options (e.g., "Pending", "Completed", "Cancelled")

## Backup and Restore

To backup the database:

```bash
cp demo.db demo.db.backup
```

To restore from backup:

```bash
cp demo.db.backup demo.db
```

## Integration with Backend

The backend application connects to this database using the configuration in `backend/src/config/db.ts`. Make sure the database is properly seeded before running the backend server.

# Data Demo Backend

This directory contains the Node.js backend API for the Data Demo project.

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **SQLite3**: Database
- **Nodemon**: Development server with hot reload

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm package manager

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

The API will be available at `http://localhost:3000`.

## Project Structure

```
backend/
├── src/                 # Source files
│   ├── config/          # Configuration files
│   │   └── db.ts        # Database connection
│   ├── controllers/     # Request handlers
│   │   └── dataController.ts # Transaction data controllers
│   ├── routes/          # API routes
│   │   └── dataRoutes.ts # Transaction data routes
│   └── types/           # TypeScript type definitions
├── server.ts            # Main server entry point
├── nodemon.json         # Nodemon configuration
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## API Endpoints

### Transaction Data

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/v1/data`     | Get all transactions     |
| GET    | `/api/v1/data/:id` | Get transaction by ID    |
| POST   | `/api/v1/data`     | Create a new transaction |
| PUT    | `/api/v1/data/:id` | Update a transaction     |
| DELETE | `/api/v1/data/:id` | Delete a transaction     |

### Status Options

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| GET    | `/api/v1/statuses` | Get all status options |

### Product Options

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| GET    | `/api/v1/products` | Get all product options |

## Error Handling

The API includes standardized error handling with appropriate HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Server Error

## Database Connection

The backend connects to an SQLite database located at `../db/demo.db`. Make sure this file exists and is properly seeded before running the application.

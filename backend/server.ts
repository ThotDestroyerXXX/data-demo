import express from "express";
import cors from "cors";
import dataRoutes from "./src/routes/dataRoutes";

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base route
app.get("/", (req, res) => {
  res.send("Data Demo API - Use /api/v1/data to access data");
});

// API routes
app.use("/api/v1", dataRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

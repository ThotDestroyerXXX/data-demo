import express from "express";
import {
  getAllData,
  getDataById,
  getAllStatuses,
  addData,
  getAllProducts,
  updateData,
} from "../controllers/dataController";

const router = express.Router();

// Data routes
router.get("/data", getAllData);
router.get("/data/:id", getDataById);
router.post("/data", addData);
router.get("/products", getAllProducts);
router.put("/data/:id", updateData);

// Status routes
router.get("/statuses", getAllStatuses);

export default router;

import { Request, Response } from "express";
import db from "../config/db";

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

export const getAllData = (req: Request, res: Response) => {
  const query = `SELECT t.*, s.name as statusName 
                 FROM data t
                 LEFT JOIN status s ON t.status = s.id`;

  db.all(query, [], (err: Error | null, rows: Transaction[]) => {
    if (err) {
      console.error("Error fetching data:", err.message);
      return res.status(500).json({ error: "Error fetching data" });
    }
    res.json({ data: rows });
  });
};

export const getDataById = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const query = `SELECT t.*, s.name as statusName 
                 FROM data t
                 LEFT JOIN status s ON t.status = s.id
                 WHERE t.id = ?`;

  db.get(query, [id], (err: Error | null, row: Transaction) => {
    if (err) {
      console.error("Error fetching transaction:", err.message);
      return res.status(500).json({ error: "Error fetching transaction" });
    }

    if (!row) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ data: row });
  });
};

export const addData = (req: Request, res: Response) => {
  const {
    productName,
    productID,
    amount,
    customerName,
    status,
    createBy,
    transactionDate,
  } = req.body;

  console.log(req.body);

  // validate that all fields are present
  if (
    !productName ||
    !productID ||
    !amount ||
    !customerName ||
    status === undefined ||
    !createBy ||
    !transactionDate
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // make new id based on last id in db
  const getIdQuery = `SELECT MAX(id) as maxId FROM data`;
  db.get(getIdQuery, [], (err: Error | null, row: { maxId: number }) => {
    if (err) {
      console.error("Error fetching max ID:", err.message);
      return res.status(500).json({ error: "Error fetching max ID" });
    }

    const newId = row.maxId + 1;

    const query = `INSERT INTO data (id, productID, productName, amount, customerName, status, transactionDate, createBy, createOn)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`;
    const params = [
      newId,
      productID,
      productName,
      amount,
      customerName,
      status,
      transactionDate,
      createBy,
    ];

    db.run(query, params, function (err: Error | null) {
      if (err) {
        console.error("Error adding transaction:", err.message);
        return res.status(500).json({ error: "Error adding transaction" });
      }

      res.status(201).json({
        message: "Transaction added successfully",
        transactionId: this.lastID,
        productID: productID,
      });
    });
  });
};

export const updateData = (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const {
    productName,
    productID,
    amount,
    customerName,
    status,
    createBy,
    transactionDate,
  } = req.body;

  // validate that all fields are present
  if (
    !productName ||
    !productID ||
    !amount ||
    !customerName ||
    status === undefined ||
    !createBy ||
    !transactionDate
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const query = `UPDATE data SET
                   productID = ?,
                   productName = ?,
                   amount = ?,
                   customerName = ?,
                   status = ?,
                   transactionDate = ?,
                   createBy = ?
                 WHERE id = ?`;
  const params = [
    productID,
    productName,
    amount,
    customerName,
    status,
    transactionDate,
    createBy,
    id,
  ];

  db.run(query, params, function (err: Error | null) {
    if (err) {
      console.error("Error updating transaction:", err.message);
      return res.status(500).json({ error: "Error updating transaction" });
    }

    res.json({
      message: "Transaction updated successfully",
      transactionId: id,
    });
  });
};

export const getAllStatuses = (req: Request, res: Response) => {
  const query = `SELECT * FROM status`;
  db.all(query, [], (err: Error | null, rows: Status[]) => {
    if (err) {
      console.error("Error fetching statuses:", err.message);
      return res.status(500).json({ error: "Error fetching statuses" });
    }
    res.json({ data: rows });
  });
};

export const getAllProducts = (req: Request, res: Response) => {
  const query = `SELECT DISTINCT productName, productID FROM data`;
  db.all(
    query,
    [],
    (err: Error | null, rows: { productName: string; productID: string }[]) => {
      if (err) {
        console.error("Error fetching products:", err.message);
        return res.status(500).json({ error: "Error fetching products" });
      }
      res.json({ data: rows });
    }
  );
};

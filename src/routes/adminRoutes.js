import express from "express";

import {
  getUsers,
  deleteUser,
  transactionUsers,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);

router.delete("/user/:id", protect, adminOnly, deleteUser);

router.get("/transactions", protect, adminOnly, transactionUsers);

export default router;
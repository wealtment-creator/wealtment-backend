import express from "express";

import {
  getUsers,
  deleteUser,
  // transactionUsers,
  fundUser,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);

router.delete("/user/:id", protect, adminOnly, deleteUser);

// router.get("/transactions", protect, adminOnly, transactionUsers);
router.put("/fund-user/:id", protect, adminOnly, fundUser);

export default router;
import express from "express";

import {
  createDeposit,
  approveDeposit,
  // rejectDeposit,
  getRecentTransactions,
  getMyDeposits,
  getAllDeposits,
} from "../controllers/depositController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
USER
*/

router.post("/", protect, createDeposit);

/*
ADMIN
*/

router.put("/approve/:id", protect, adminOnly, approveDeposit);
// router.put("/reject/:id", protect, adminOnly, rejectDeposit);

router.get("/recent-transactions", protect, adminOnly, getRecentTransactions);

// ADMIN - get all deposits
router.get("/", protect, adminOnly, getAllDeposits);
router.get("/my", protect, getMyDeposits);

export default router;
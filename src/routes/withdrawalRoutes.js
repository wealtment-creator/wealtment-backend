import express from "express";
import {
  createWithdrawal,
  approveWithdrawal,
  getAllWithdrawals,
  getMyWithdrawals,
} from "../controllers/withdrawalController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
USER
*/

router.post("/", protect, createWithdrawal);

/*
ADMIN
*/

// router.put("/approve/:id", protect, adminOnly, approveWithdrawal);

router.put("/approve/:id", protect, adminOnly, approveWithdrawal);
router.get("/", protect, adminOnly, getAllWithdrawals);
router.post("/", protect, createWithdrawal);

// router.get("/my", protect, getMyWithdrawals);

export default router;
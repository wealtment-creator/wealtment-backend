import express from "express";

import {
  getUsers,
  deleteUser,
  // transactionUsers,
  fundUser,
  getAllActiveInvestments,
  getAllReferrals,
  getAllDeposits,
  deductUserBalance,
  updateUser,
  rejectDeposit,
  rejectWithdrawal,
  deleteWithdrawal,
  deleteDeposit,
} from "../controllers/adminController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, adminOnly, getUsers);

router.delete("/user/:id", protect, adminOnly, deleteUser);

// router.get("/transactions", protect, adminOnly, transactionUsers);
router.put("/fund-user/:id", protect, adminOnly, fundUser);

router.get("/investments", protect, adminOnly, getAllActiveInvestments);
router.get("/referrals", protect, adminOnly, getAllReferrals);
router.get("/", protect, adminOnly, getAllDeposits);
router.put("/deduct/:id", protect, adminOnly, deductUserBalance)
router.put("/users/:id", protect, adminOnly, updateUser);
router.delete("/deposit/:id", protect, adminOnly, deleteDeposit);
router.put("/deposit/reject/:id", protect, adminOnly, rejectDeposit);
router.delete("/withdrawal/:id", protect, adminOnly, deleteWithdrawal);
router.put("/withdrawal/reject/:id", protect, adminOnly, rejectWithdrawal);
export default router;
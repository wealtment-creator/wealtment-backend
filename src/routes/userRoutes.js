import express from "express";

import {
  getBalance,
  getDepositHistory,
  getLastDeposit,
  getTotalDeposit,
  // updateProfile,
  updateUserProfile,
  changePassword,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/balance", protect, getBalance);

router.get("/deposit-history", protect, getDepositHistory);

router.get("/last-deposit", protect, getLastDeposit);

router.get("/total-deposit", protect, getTotalDeposit);

// router.put("/update-profile", protect, updateProfile);

router.put("/profile", protect, updateUserProfile);
router.put("/change-password", protect, changePassword);

export default router;

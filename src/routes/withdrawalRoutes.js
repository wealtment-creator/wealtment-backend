import express from "express";
import {
  createWithdrawal,
  approveWithdrawal,
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

router.put("/approve/:id", protect, adminOnly, approveWithdrawal);

export default router;
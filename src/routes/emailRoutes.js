import express from "express";
import {
sendBulkEmail,
sendSingleEmail,
sendSelectedEmails,
} from "../controllers/emailController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send/all", protect, adminOnly, sendBulkEmail);
router.post("/send/user/:id", protect, adminOnly, sendSingleEmail);
router.post("/send/selected", protect, adminOnly, sendSelectedEmails);

export default router
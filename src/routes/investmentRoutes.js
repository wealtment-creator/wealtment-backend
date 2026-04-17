import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
createInvestment,
getMyInvestments,
// getAllActiveInvestments,
} from "../controllers/investmentController.js";

const router = express.Router();

router.post("/", protect, createInvestment);
router.get("/my", protect, getMyInvestments);


export default router;











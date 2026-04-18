import express from "express";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  logoutUser,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/logout", logoutUser);
router.get("/me",protect, getMe);
export default router;




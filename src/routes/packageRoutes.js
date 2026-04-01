import express from "express";

import {
  createPackage,
  getPackages,
  updatePackage,
  deletePackage,
} from "../controllers/packageController.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

/*
ADMIN
*/

router.post("/", protect, adminOnly, createPackage);

router.put("/:id", protect, adminOnly, updatePackage);

router.delete("/:id", protect, adminOnly, deletePackage);

/*
PUBLIC
*/

router.get("/", getPackages);

export default router;
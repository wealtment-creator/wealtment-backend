import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import depositRoutes from "./routes/depositRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";

import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const app = express();

/*
========================================
GLOBAL MIDDLEWARE
========================================
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

/*
========================================
HEALTH CHECK ROUTE
========================================
*/
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Wealthment API is running",
  });
});

/*
========================================
API ROUTES
========================================
*/
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/withdrawals", withdrawalRoutes);

/*
========================================
404 NOT FOUND
========================================
*/
app.use(notFound);

/*
========================================
GLOBAL ERROR HANDLER
========================================
*/
app.use(errorHandler);

export default app;
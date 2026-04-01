import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import depositRoutes from "./routes/depositRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import withdrawalRoutes from "./routes/withdrawalRoutes.js";

// Utils
import { sendEmail } from "./utils/resend.js";

// Load env variables
dotenv.config();

const app = express();

// Connect Database
connectDB();

// =======================
// CORS Setup
// =======================
const allowedOrigins = [
"http://localhost:3000",
"http://localhost:3001",
"http://localhost:5173",
process.env.FRONTEND_URL, // deployed frontend
];

app.use(
cors({
origin: function (origin, callback) {
if (!origin) return callback(null, true); // allow Postman or server requests
const allowed = allowedOrigins.some((o) => origin.startsWith(o));
if (allowed) return callback(null, true);
console.log("Blocked by CORS:", origin);
return callback(new Error("Not allowed by CORS"));
},
credentials: true,
})
);

// =======================
// Middlewares
// =======================
app.use(express.json());

// =======================
// Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/deposit", depositRoutes);
app.use("/api/package", packageRoutes);
app.use("/api/withdrawals", withdrawalRoutes);

// =======================
// Test Email Route
// =======================
app.get("/test-email", async (req, res) => {
try {
await sendEmail({
to: "yourrealemail@gmail.com",
subject: "Test Email",
html: "<h1>Email Working!</h1>",
});
res.json({ message: "Email sent successfully" });
} catch (err) {
console.error("Test email error:", err);
res.status(500).json({ error: err.message });
}
});

// =======================
// Health Check
// =======================
app.get("/", (req, res) => {
res.json({ message: "Wealthment API running" });
});

export default app;

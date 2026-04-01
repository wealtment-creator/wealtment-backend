import dotenv from "dotenv";
import path from "path";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initResend } from "./utils/resend.js";

// Load .env first
dotenv.config({ path: path.resolve("../.env") });

// Initialize Resend API key
initResend(process.env.RESEND_API_KEY);

// Connect to MongoDB
// connectDB();

// Start server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});

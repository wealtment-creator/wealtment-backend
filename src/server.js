import dotenv from "dotenv";
import path from "path";
import app from "./app.js";

// Load .env from backend root
dotenv.config({ path: path.resolve("../.env") });

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
console.log(`Server running on http://localhost:${PORT}`);
});

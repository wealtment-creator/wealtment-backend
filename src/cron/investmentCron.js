import cron from "node-cron";
import Investment from "../models/investmentModel.js";
import User from "../models/userModel.js";
import { sendRoiCreditedEmail } from "../services/emailService.js";

cron.schedule("*/1 * * * *", async () => {
console.log("Checking expired investments...");

const expiredInvestments = await Investment.find({
status: "active",
endDate: { $lte: new Date() },
isCredited: false,
});

for (const inv of expiredInvestments) {
const user = await User.findById(inv.user);

if (user) {
// credit user wallet
user.balance += inv.amount + inv.totalProfit;
await user.save();

// update investment
inv.status = "completed";
inv.isCredited = true;
await inv.save();

// SEND ROI EMAIL
try {
await sendRoiCreditedEmail(
user.email,
user.name,
inv.totalProfit
);
} catch (error) {
console.log("ROI email error:", error.message);
}
}
}
});
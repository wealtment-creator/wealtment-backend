import Withdrawal from "../models/withdrawalModel.js";
import User from "../models/userModel.js";
import {
  sendWithdrawalApprovedEmail,
  sendAdminWithdrawalRequestEmail,
} from "../services/emailService.js";
import asyncHandler from "express-async-handler";


// ADMIN APPROVE ALL WITHDRAWLS

export const approveWithdrawal = asyncHandler(async (req, res) => {
const withdrawal = await Withdrawal.findById(req.params.id).populate("user");

if (!withdrawal) {
res.status(404);
throw new Error("Withdrawal not found");
}

if (withdrawal.status !== "pending") {
res.status(400);
throw new Error("Already processed");
}

const user = withdrawal.user;

// ✅ CHECK BALANCE
if (user.balance < withdrawal.amount) {
res.status(400);
throw new Error("Insufficient user balance");
}

// ✅ DEDUCT BALANCE
user.balance -= withdrawal.amount;
await user.save();

// ✅ UPDATE STATUS
withdrawal.status = "approved";
withdrawal.isCredited = true;
withdrawal.approvedAt = new Date();
withdrawal.approvedBy = req.user._id;

await withdrawal.save();
try {
await sendWithdrawalApprovedEmail(
user.email,
user.name,
withdrawal.amount,
withdrawal.coinType
);
} catch (error) {
console.log("Email error:", error.message);
}


res.json({
message: "Withdrawal approved & balance deducted",
withdrawal,
});
});



// ADMIN GET ALL WITHDRAWALS
export const getAllWithdrawals = asyncHandler(async (req, res) => {
const withdrawals = await Withdrawal.find()
.populate("user", "name email")
.sort({ createdAt: -1 });

res.json(withdrawals);
});



// GETMYWITHDRAWAL

export const getMyWithdrawals = asyncHandler(async (req, res) => {
const withdrawals = await Withdrawal.find({
user: req.user._id,
}).sort({ createdAt: -1 });

res.json(withdrawals);
});

// USER CREATE WITHDRAWAL

export const createWithdrawal = asyncHandler(async (req, res) => {
const { amount, coinType, walletAddress } = req.body;

// validate
if (!amount || !coinType || !walletAddress) {
res.status(400);
throw new Error("All fields are required");
}

const user = await User.findById(req.user._id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

// check balance
if (user.balance < amount) {
res.status(400);
throw new Error("Insufficient balance");
}

const withdrawal = await Withdrawal.create({
user: req.user._id,
amount,
coinType,
walletAddress,
status: "pending",
});

try {
await sendAdminWithdrawalRequestEmail(user.name, user.email, amount);
} catch (error) {
console.log("Email error:", error.message);
}


res.status(201).json(withdrawal);
});










import Withdrawal from "../models/withdrawalModel.js";
import User from "../models/userModel.js";
import {
  sendWithdrawalApprovedEmail,
  sendAdminWithdrawalRequestEmail,
  sendWithdrawalRequestEmail,
} from "../services/emailService.js";
import asyncHandler from "express-async-handler";


// ADMIN APPROVE ALL WITHDRAWLS

export const approveWithdrawal = asyncHandler(async (req, res) => {
const { description } = req.body;

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

if (user.balance < withdrawal.amount) {
res.status(400);
throw new Error("Insufficient user balance");
}

user.balance -= withdrawal.amount;
await user.save();

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
withdrawal.coinType,
withdrawal.walletAddress,
description
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

const availableBalance = parseFloat(user.balance);
const withdrawalAmount = parseFloat(amount);

console.log("Balance", availableBalance, typeof availableBalance);
console.log("Amount:", withdrawalAmount, typeof withdrawalAmount);

// check balance
if (Number(user.balance) < Number(amount)) {
res.status(400);
throw new Error("Insufficient balance");
}

const withdrawal = await Withdrawal.create({
user: req.user._id,
amount: withdrawalAmount,
coinType,
walletAddress,
status: "pending",
});

// EMAIL TO USER
try {
await sendWithdrawalRequestEmail(
user.email,
user.name,
amount,
coinType
);
} catch (error) {
console.log("User email error:", error.message);
}

// EMAIL TO ADMIN
try {
await sendAdminWithdrawalRequestEmail(
user.name,
user.email,
amount
);
} catch (error) {
console.log("Admin email error:", error.message);
}

res.status(201).json(withdrawal);
});










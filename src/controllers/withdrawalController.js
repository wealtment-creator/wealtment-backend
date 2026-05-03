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
const { description } = req.body || {};

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

// ✅ CHECK BASED ON COIN
if (
withdrawal.coinType === "bitcoin" &&
user.btcBalance < withdrawal.amount
) {
res.status(400);
throw new Error("Insufficient BTC balance");
}

if (
withdrawal.coinType === "litecoin" &&
user.ltcBalance < withdrawal.amount
) {
res.status(400);
throw new Error("Insufficient LTC balance");
}

// ✅ DEDUCT FROM CORRECT WALLET
if (withdrawal.coinType === "bitcoin") {
user.btcBalance -= withdrawal.amount;
}

if (withdrawal.coinType === "litecoin") {
user.ltcBalance -= withdrawal.amount;
}

// keep total balance consistent
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
const withdrawals = await Withdrawal.find({ isDeleted: false })
.populate("user", "name email")
.sort({ createdAt: -1 });

res.json(withdrawals);
});



// GETMYWITHDRAWAL

export const getMyWithdrawals = asyncHandler(async (req, res) => {
const withdrawals = await Withdrawal.find({
user: req.user._id,
isDeleted: false,
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

const withdrawalAmount = Number(String(amount).replace(/,/g, ""));

if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
res.status(400);
throw new Error("Invalid withdrawal amount");
}

// ✅ GET CORRECT BALANCE BASED ON COIN
let availableBalance = 0;

if (coinType === "bitcoin") {
availableBalance = user.btcBalance;
} else if (coinType === "litecoin") {
availableBalance = user.ltcBalance;
} else {
res.status(400);
throw new Error("Invalid coin type");
}

console.log("Available:", availableBalance);
console.log("Requested:", withdrawalAmount);

// ✅ CHECK BALANCE
if (availableBalance < withdrawalAmount) {
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
withdrawalAmount,
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
withdrawalAmount
);
} catch (error) {
console.log("Admin email error:", error.message);
}

res.status(201).json(withdrawal);
});

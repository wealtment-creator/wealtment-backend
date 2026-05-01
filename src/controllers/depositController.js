import Deposit from "../models/depositModel.js";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import asyncHandler from "express-async-handler";
import {
  sendDepositApprovedEmail,
  sendAdminDepositRequestEmail,
  sendDepositRequestEmail,
  sendDepositRejectedEmail,
} from "../services/emailService.js";

export const createDeposit = async (req, res) => {
try {
const { coinType, amount } = req.body;

if (!coinType || !amount) {
return res.status(400).json({
success: false,
message: "coinType and amount required",
});
}

const deposit = await Deposit.create({
user: req.user.id,
coinType,
amount,
});

const user = await User.findById(req.user.id);

// EMAIL TO USER
try {
await sendDepositRequestEmail(
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
await sendAdminDepositRequestEmail(
user.name,
user.email,
amount
);
} catch (error) {
console.log("Admin email error:", error.message);
}

res.status(201).json({
success: true,
message: "Deposit request submitted",
deposit,
});
} catch (error) {
res.status(500).json({ message: error.message });
}
};

export const approveDeposit = async (req, res) => {
try {
const deposit = await Deposit.findById(req.params.id);

if (!deposit) {
return res.status(404).json({
success: false,
message: "Deposit not found",
});
}

if (deposit.status !== "pending") {
return res.status(400).json({
success: false,
message: "Already processed",
});
}

// ✅ GET USER FIRST (needed for referral)
const user = await User.findById(deposit.user);

if (!user) {
return res.status(404).json({
success: false,
message: "User not found",
});
}

// ✅ UPDATED BALANCE LOGIC
const updateFields = {
$inc: {
balance: Number(deposit.amount),
},
};

if (deposit.coinType === "bitcoin") {
updateFields.$inc.btcBalance = Number(deposit.amount);
}

if (deposit.coinType === "litecoin") {
updateFields.$inc.ltcBalance = Number(deposit.amount);
}

await User.findByIdAndUpdate(deposit.user, updateFields);

/*
========================================
REFERRAL BONUS (NEW - SAFE)
========================================
*/
if (user.referredBy) {
const referrer = await User.findById(user.referredBy);

if (referrer) {
const bonus = Number(deposit.amount) * 0.1; // 10%

// ✅ credit correct wallet
if (deposit.coinType === "bitcoin") {
referrer.btcBalance += bonus;
}

if (deposit.coinType === "litecoin") {
referrer.ltcBalance += bonus;
}

// keep total balance
referrer.balance += bonus;
referrer.referralEarnings += bonus;

await referrer.save();
}
}

// ✅ Update deposit
const updatedDeposit = await Deposit.findByIdAndUpdate(
req.params.id,
{
status: "approved",
approvedBy: req.user.id,
approvedAt: new Date(),
},
{ new: true }
);

// SEND EMAIL
try {
await sendDepositApprovedEmail(
user.email,
user.name,
deposit.amount,
deposit.coinType
);
} catch (error) {
console.log("Email error:", error.message);
}

console.log("Approved Deposit:", updatedDeposit);

return res.status(200).json({
success: true,
message: "Deposit approved and balance updated",
deposit: updatedDeposit,
});
} catch (error) {
console.log("Approve Deposit Error:", error);
return res.status(500).json({
success: false,
message: error.message,
});
}
};




export const rejectDeposit = async (req, res) => {
try {
const deposit = await Deposit.findById(req.params.id);

if (!deposit) {
return res.status(404).json({
success: false,
message: "Deposit not found",
});
}

deposit.status = "rejected";
deposit.approvedBy = req.user.id;
deposit.approvedAt = new Date();

await deposit.save();

// SEND EMAIL
const user = await User.findById(deposit.user);

try {
await sendDepositRejectedEmail(
user.email,
user.name,
deposit.amount,
deposit.coinType
);
} catch (error) {
console.log("Email error:", error.message);
}

res.json({
success: true,
message: "Deposit rejected",
});
} catch (error) {
res.status(500).json({ message: error.message });
}
};
/*
========================================
ADMIN RECENT TRANSACTIONS
========================================
*/

export const getRecentTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
GET ALL DEPOSITS (ADMIN)
========================================
*/
export const getMyDeposits = asyncHandler(async (req, res) => {
const deposits = await Deposit.find({
user: req.user._id,
}).sort({ createdAt: -1 });

res.json(deposits);
});



export const getAllDeposits = asyncHandler(async (req, res) => {
const deposits = await Deposit.find()
.populate("user", "name email")
.sort({ createdAt: -1 });

res.json(deposits);
});







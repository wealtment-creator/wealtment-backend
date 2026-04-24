import Deposit from "../models/depositModel.js";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import asyncHandler from "express-async-handler";
import {
  sendDepositApprovedEmail,
  sendAdminDepositRequestEmail,
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

const user = await User.findById(req.user.id); // ✅

try {
await sendAdminDepositRequestEmail(user.name, user.email, amount);
} catch (error) {
console.log("Email error:", error.message);
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




/*
========================================
ADMIN APPROVE DEPOSIT
========================================
*/
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

// Update user balance
await User.findByIdAndUpdate(deposit.user, {
$inc: { balance: Number(deposit.amount) },
});

// Update deposit directly in DB
const updatedDeposit = await Deposit.findByIdAndUpdate(
req.params.id,
{
status: "approved",
approvedBy: req.user.id,
approvedAt: new Date(),
},
{ new: true }
);

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

/*
========================================
ADMIN REJECT DEPOSIT
========================================
*/

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







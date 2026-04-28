import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import asyncHandler from "express-async-handler";
import Investment from "../models/investmentModel.js"
import {sendWalletFundedEmail} from "../services/emailService.js"
import bcrypt from "bcryptjs";

/*
========================================
LIST USERS
========================================
*/

export const getUsers = async (req, res) => {
try {
const users = await User.find()
.select("-password") // ❌ never expose password
.sort({ createdAt: -1 });

res.json({
success: true,
count: users.length,
users,
});
} catch (error) {
res.status(500).json({
message: error.message,
});
}
};


/*
========================================
DELETE USER
========================================
*/

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// /*
// ========================================
// USER BEHIND TRANSACTION
// ========================================
// */

// export const transactionUsers = async (req, res) => {
//   try {
//     const transactions = await Transaction.find()
//       .populate("user", "name email balance")
//       .sort({ createdAt: -1 });

//     res.json({
//       success: true,
//       transactions,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


export const fundUser = asyncHandler(async (req, res) => {
const { amount, withdrawalId } = req.body;

// 1. Validate amount
if (!amount || isNaN(amount)) {
res.status(400);
throw new Error("Valid amount is required");
}

// 2. Find user
const user = await User.findById(req.params.id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

// 3. Add balance
user.balance += Number(amount);
await user.save();

// EMAIL TO USER
try {
await sendWalletFundedEmail(
user.email,
user.name,
amount
);
} catch (error) {
console.log("User email error:", error.message);
}

let updatedWithdrawal = null;

// 4. OPTIONAL: If this funding is for a withdrawal, update it
if (withdrawalId) {
const withdrawal = await Withdrawal.findById(withdrawalId);

if (!withdrawal) {
res.status(404);
throw new Error("Withdrawal not found");
}

if (withdrawal.status !== "pending") {
res.status(400);
throw new Error("Withdrawal already processed");
}

withdrawal.status = "approved";
withdrawal.isCredited = true;
withdrawal.approvedBy = req.user._id;
withdrawal.approvedAt = new Date();

await withdrawal.save();

updatedWithdrawal = withdrawal;
}

res.json({
message: "User funded successfully",
userBalance: user.balance,
withdrawal: updatedWithdrawal,
});
});




/*
========================================
ADMIN - GET ALL ACTIVE INVESTMENTS
========================================
*/
export const getAllActiveInvestments = asyncHandler(async (req, res) => {
const investments = await Investment.find({
status: "active",
})
.populate("user", "name email")
.populate("package", "name minimumDeposit maximumDeposit profitPercentage duration")
.sort({ createdAt: -1 });

const now = new Date();

const formatted = investments.map((inv) => {
if (!inv.startDate || !inv.endDate) {
return inv; // avoid crash
}

const totalDuration = inv.endDate - inv.startDate;

if (totalDuration <= 0) {
return inv; // avoid divide-by-zero crash
}

const progress = (now - inv.startDate) / totalDuration;

const currentProfit =
(inv.totalProfit || 0) * Math.min(progress, 1);

return {
...inv._doc,
currentProfit: Math.max(0, currentProfit),
progress: Math.min(progress * 100, 100),
};
});

res.json(formatted);
});


export const getAllReferrals = asyncHandler(async (req, res) => {
const users = await User.find({ referredBy: { $ne: null } })
.populate("referredBy", "name email")
.select("name email referralEarnings");

res.json(users);
});



export const getAllDeposits = asyncHandler(async (req, res) => {
const deposits = await Deposit.find()
.populate("user", "name email")
.sort({ createdAt: -1 });

res.json({
success: true,
count: deposits.length,
deposits,
});
});


export const deductUserBalance = asyncHandler(async (req, res) => {
const { amount } = req.body;

if (!amount || isNaN(amount)) {
res.status(400);
throw new Error("Valid amount is required");
}

const user = await User.findById(req.params.id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

if (user.balance < amount) {
res.status(400);
throw new Error("Insufficient user balance");
}

user.balance -= Number(amount);

await user.save();

res.json({
success: true,
message: "Amount deducted successfully",
userBalance: user.balance,
});
});


/*
========================================
ADMIN UPDATE USER
========================================
*/
export const updateUser = asyncHandler(async (req, res) => {
const { name, email, bitcoinAddress, litecoinAddress, password } = req.body;

const user = await User.findById(req.params.id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

user.name = name || user.name;
user.email = email || user.email;
user.bitcoinAddress = bitcoinAddress || user.bitcoinAddress;
user.litecoinAddress = litecoinAddress || user.litecoinAddress;

if (password) {
  user.password = password;
}
const updatedUser = await user.save();

res.json({
success: true,
message: "User updated successfully",
user: {
_id: updatedUser._id,
name: updatedUser.name,
email: updatedUser.email,
bitcoinAddress: updatedUser.bitcoinAddress,
litecoinAddress: updatedUser.litecoinAddress,
balance: updatedUser.balance,
},
});
});

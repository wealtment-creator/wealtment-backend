import Withdrawal from "../models/withdrawalModel.js";
import User from "../models/userModel.js";
import {
  sendWithdrawalRequestEmail,
  sendWithdrawalApprovedEmail,
} from "../services/emailService.js";
import asyncHandler from "express-async-handler";
/*
========================================
USER CREATE WITHDRAWAL
========================================
*/

// export const createWithdrawal = async (req, res) => {
//   try {
//     const { coinType, walletAddress, amount } = req.body;

//     if (!coinType || !walletAddress || !amount) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields required",
//       });
//     }

//     const user = await User.findById(req.user.id);

//     if (!user)
//       return res.status(404).json({
//         success: false,
//         message: "User not found",
//       });

//     /*
//     Check balance
//     */

//     if (user.balance < amount) {
//       return res.status(400).json({
//         success: false,
//         message: "Insufficient balance",
//       });
//     }

//     const withdrawal = await Withdrawal.create({
//       user: user._id,
//       coinType,
//       walletAddress,
//       amount,
//     });

//     /*
//     Send email
//     */

//     await sendWithdrawalRequestEmail(
//       user.email,
//       user.name,
//       amount,
//       coinType
//     );

//     res.status(201).json({
//       success: true,
//       message: "Withdrawal request created",
//       withdrawal,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

/*
========================================
ADMIN APPROVE WITHDRAWAL
========================================
*/

// export const approveWithdrawal = async (req, res) => {
//   try {
//     const withdrawal = await Withdrawal.findById(req.params.id).populate("user");

//     if (!withdrawal) {
//       return res.status(404).json({
//         success: false,
//         message: "Withdrawal not found",
//       });
//     }

//     if (withdrawal.status !== "pending") {
//       return res.status(400).json({
//         success: false,
//         message: "Already processed",
//       });
//     }

//     const user = withdrawal.user;

//     /*
//     Deduct balance
//     */

//     user.balance -= withdrawal.amount;
//     await user.save();

//     withdrawal.status = "approved";
//     withdrawal.approvedBy = req.user.id;
//     withdrawal.approvedAt = new Date();

//     await withdrawal.save();

//     /*
//     Send email
//     */

//     await sendWithdrawalApprovedEmail(
//       user.email,
//       user.name,
//       withdrawal.amount,
//       withdrawal.coinType
//     );

//     res.json({
//       success: true,
//       message: "Withdrawal approved",
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };


// ADMIN APPROVE ALL WITHDRAWLS

export const approveWithdrawal = asyncHandler(async (req, res) => {
const withdrawal = await Withdrawal.findById(req.params.id);

if (!withdrawal) {
res.status(404);
throw new Error("Withdrawal not found");
}

if (withdrawal.status !== "pending") {
res.status(400);
throw new Error("Already processed");
}

// ✅ mark as paid
withdrawal.status = "approved";
withdrawal.isCredited = true;
withdrawal.approvedAt = new Date();
withdrawal.approvedBy = req.user._id;

await withdrawal.save();

res.json({
message: "Withdrawal marked as PAID successfully",
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
coinType, // ✅ FIXED
walletAddress, // ✅ FIXED
status: "pending",
});

res.status(201).json(withdrawal);
});










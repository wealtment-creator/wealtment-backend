import User from "../models/userModel.js";
import Deposit from "../models/depositModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import {
sendPasswordChangedEmail,
} from "../services/emailService.js";

/*
========================================
FETCH USER BALANCE
========================================
*/

export const getBalance = async (req, res) => {
try {
const user = await User.findById(req.user.id).select("balance btcBalance ltcBalance");

if (!user) {
return res.status(404).json({
success: false,
message: "User not found",
});
}

return res.json({
success: true,
balance: user.balance,
btcBalance: user.btcBalance,
ltcBalance: user.ltcBalance,
});

} catch (error) {
return res.status(500).json({
success: false,
message: error.message,
});
}
};


/*
========================================
FETCH DEPOSIT HISTORY
========================================
*/

export const getDepositHistory = async (req, res) => {
  try {
    const { from, to } = req.query;

    const deposits = await Deposit.find({
      user: req.user.id,
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    });

    res.json({
      success: true,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
LAST DEPOSIT
========================================
*/

export const getLastDeposit = async (req, res) => {
  try {
    const lastDeposit = await Deposit.findOne({
      user: req.user.id,
      status: "approved",
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      lastDeposit,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
TOTAL DEPOSIT
========================================
*/

export const getTotalDeposit = async (req, res) => {
  try {
    const deposits = await Deposit.find({
      user: req.user.id,
      status: "approved",
    });

    const total = deposits.reduce(
      (sum, item) => sum + item.creditAmount,
      0
    );

    res.json({
      success: true,
      total,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
UPDATE PROFILE
========================================
*/

export const updateUserProfile = asyncHandler(async (req, res) => {
 const user = await User.findById(req.user._id);

 if (!user) {
 res.status(404);
 throw new Error("User not found");
 }

 // Update only allowed fields
 user.name = req.body.name || user.name;
 user.bitcoinAddress = req.body.bitcoinAddress || user.bitcoinAddress;
 user.litecoinAddress = req.body.litecoinAddress || user.litecoinAddress;

 const updatedUser = await user.save();

 res.json({
 message: "Profile updated successfully",
 _id: updatedUser._id,
 name: updatedUser.name,
 email: updatedUser.email,
 bitcoinAddress: updatedUser.bitcoinAddress,
 litecoinAddress: updatedUser.litecoinAddress,
 });
});

/*
========================================
CHANGE PASSWORD (USER)
========================================
*/
export const changePassword = asyncHandler(async (req, res) => {
const { currentPassword, newPassword } = req.body;

// Validate input
if (!currentPassword || !newPassword) {
res.status(400);
throw new Error("Current password and new password are required");
}

// Password strength check (same as signup)
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;

if (!passwordRegex.test(newPassword)) {
res.status(400);
throw new Error("Password must contain letters and numbers");
}

// Get logged-in user
const user = await User.findById(req.user._id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

// Compare current password
const isMatch = await bcrypt.compare(currentPassword, user.password);

if (!isMatch) {
res.status(401);
throw new Error("Current password is incorrect");
}

// Hash new password
user.password = newPassword;

await user.save();
try {
await sendPasswordChangedEmail(user.email, user.name);
} catch (error) {
console.log("Email error:", error.message);
}


res.json({
message: "Password updated successfully",
});
});



export const getUserProfile = asyncHandler(async (req, res) => {
 const user = await User.findById(req.user._id).select("-password");

 if (!user) {
 res.status(404);
 throw new Error("User not found");
 }

 res.json({
 _id: user._id,
 name: user.name,
 email: user.email,
 role: user.role,
 balance: user.balance || 0,
 btcBalance: user.btcBalance || 0,
 ltcBalance: user.ltcBalance || 0,
 referralBalance: user.referralEarnings,
 totalBalance: user.balance + user.referralEarnings,
 bitcoinAddress: user.bitcoinAddress || "",
 litecoinAddress: user.litecoinAddress || "",
 });
});


/*
========================================
GET MY REFERRALS + EARNINGS
========================================
*/
export const getMyReferrals = asyncHandler(async (req, res) => {
const userId = req.user._id;

// Find users referred by this user
const referrals = await User.find({ referredBy: userId })
.select("name email createdAt hasInvested")
.sort({ createdAt: -1 });

// Get current user for earnings
const user = await User.findById(userId).select("referralCode name referralEarnings");

res.json({
  referralName: user.name,
  referralCode: user.referralCode,
totalReferrals: referrals.length,
totalEarnings: user.referralEarnings,
referrals,
});
});

/*
========================================
TRANSFER REFERRAL EARNINGS TO WALLET
========================================
*/
export const transferReferralToWallet = asyncHandler(async (req, res) => {
const { amount, coinType } = req.body;

const amountNumber = Number(amount);

if (!amountNumber || amountNumber <= 0 || !coinType) {
res.status(400);
throw new Error("Valid amount and coinType are required");
}

const user = await User.findById(req.user._id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

if (user.referralEarnings < amountNumber) {
res.status(400);
throw new Error("Insufficient referral balance");
}

// ✅ move to correct wallet
if (coinType === "bitcoin") {
user.btcBalance += amountNumber;
}

if (coinType === "litecoin") {
user.ltcBalance += amountNumber;
}

// keep total balance
user.balance += amountNumber;

user.referralEarnings -= amountNumber;

await user.save();

res.json({
message: "Transfer successful",
balance: user.balance,
btcBalance: user.btcBalance,
ltcBalance: user.ltcBalance,
referralBalance: user.referralEarnings,
});
});
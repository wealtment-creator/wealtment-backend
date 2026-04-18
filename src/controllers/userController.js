import User from "../models/userModel.js";
import Deposit from "../models/depositModel.js";
import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";

/*
========================================
FETCH USER BALANCE
========================================
*/

export const getBalance = async (req, res) => {
try {
const user = await User.findById(req.user.id).select("balance");

if (!user) {
return res.status(404).json({
success: false,
message: "User not found",
});
}

return res.json({
success: true,
balance: user.balance,
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

// export const updateProfile = async (req, res) => {
//   try {
//     const { name, bitcoinAddress, litecoinAddress } = req.body;

//     const user = await User.findById(req.user.id);

//     user.name = name || user.name;
//     user.bitcoinAddress = bitcoinAddress || user.bitcoinAddress;
//     user.litecoinAddress = litecoinAddress || user.litecoinAddress;

//     await user.save();

//     res.json({
//       success: true,
//       message: "Profile updated",
//       user,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


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
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(newPassword, salt);

await user.save();

res.json({
message: "Password updated successfully",
});
});















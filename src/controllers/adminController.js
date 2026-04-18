import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import asyncHandler from "express-async-handler";
import Investment from "../models/investmentModel.js"

/*
========================================
LIST USERS
========================================
*/

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json({
      success: true,
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
const { amount } = req.body;

const user = await User.findById(req.params.id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

user.balance += Number(amount);

await user.save();

res.json({ message: "User funded successfully" });
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








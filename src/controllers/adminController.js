import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";
import asyncHandler from "express-async-handler";

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




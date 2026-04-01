import Withdrawal from "../models/withdrawalModel.js";
import User from "../models/userModel.js";
import {
  sendWithdrawalRequestEmail,
  sendWithdrawalApprovedEmail,
} from "../services/emailService.js";

/*
========================================
USER CREATE WITHDRAWAL
========================================
*/

export const createWithdrawal = async (req, res) => {
  try {
    const { coinType, walletAddress, amount } = req.body;

    if (!coinType || !walletAddress || !amount) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user)
      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    /*
    Check balance
    */

    if (user.balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    const withdrawal = await Withdrawal.create({
      user: user._id,
      coinType,
      walletAddress,
      amount,
    });

    /*
    Send email
    */

    await sendWithdrawalRequestEmail(
      user.email,
      user.name,
      amount,
      coinType
    );

    res.status(201).json({
      success: true,
      message: "Withdrawal request created",
      withdrawal,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/*
========================================
ADMIN APPROVE WITHDRAWAL
========================================
*/

export const approveWithdrawal = async (req, res) => {
  try {
    const withdrawal = await Withdrawal.findById(req.params.id).populate("user");

    if (!withdrawal) {
      return res.status(404).json({
        success: false,
        message: "Withdrawal not found",
      });
    }

    if (withdrawal.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Already processed",
      });
    }

    const user = withdrawal.user;

    /*
    Deduct balance
    */

    user.balance -= withdrawal.amount;
    await user.save();

    withdrawal.status = "approved";
    withdrawal.approvedBy = req.user.id;
    withdrawal.approvedAt = new Date();

    await withdrawal.save();

    /*
    Send email
    */

    await sendWithdrawalApprovedEmail(
      user.email,
      user.name,
      withdrawal.amount,
      withdrawal.coinType
    );

    res.json({
      success: true,
      message: "Withdrawal approved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
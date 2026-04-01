import Deposit from "../models/depositModel.js";
import User from "../models/userModel.js";
import Transaction from "../models/transactionModel.js";

import {
  sendDepositRequestEmail,
  sendDepositApprovedEmail,
} from "../services/emailService.js";

/*
========================================
USER CREATE DEPOSIT
========================================
*/

export const createDeposit = async (req, res) => {
  try {
    const { coinType, debitAmount, creditAmount, profit } = req.body;

    if (!coinType || !debitAmount || !creditAmount || !profit) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    const user = await User.findById(req.user.id);

    const deposit = await Deposit.create({
      user: user._id,
      coinType,
      debitAmount,
      creditAmount,
      profit,
    });

    /*
    Transaction record
    */

    await Transaction.create({
      user: user._id,
      type: "deposit",
      amount: creditAmount,
      coinType,
      status: "pending",
    });

    /*
    Send email
    */

    await sendDepositRequestEmail(
      user.email,
      user.name,
      creditAmount,
      coinType
    );

    res.status(201).json({
      success: true,
      message: "Deposit submitted",
      deposit,
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
ADMIN APPROVE DEPOSIT
========================================
*/

export const approveDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id).populate("user");

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: "Deposit not found",
      });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({
        message: "Already processed",
      });
    }

    const user = deposit.user;

    /*
    Add balance
    */

    user.balance += deposit.creditAmount;

    await user.save();

    deposit.status = "approved";
    deposit.approvedBy = req.user.id;
    deposit.approvedAt = new Date();

    await deposit.save();

    /*
    Update transaction
    */

    await Transaction.findOneAndUpdate(
      {
        user: user._id,
        type: "deposit",
        amount: deposit.creditAmount,
      },
      { status: "approved" }
    );

    /*
    Send email
    */

    await sendDepositApprovedEmail(
      user.email,
      user.name,
      deposit.creditAmount,
      deposit.coinType
    );

    res.json({
      success: true,
      message: "Deposit approved",
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
ADMIN REJECT DEPOSIT
========================================
*/

export const rejectDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    deposit.status = "rejected";

    await deposit.save();

    res.json({
      success: true,
      message: "Deposit rejected",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
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
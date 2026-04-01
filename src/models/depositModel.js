import mongoose from "mongoose";

/*
========================================
DEPOSIT SCHEMA
========================================
User submits deposit
Admin approves or rejects
*/

const depositSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    coinType: {
      type: String,
      enum: ["bitcoin", "litecoin"],
      required: true,
    },

    debitAmount: {
      type: Number,
      required: true,
    },

    creditAmount: {
      type: Number,
      required: true,
    },

    profit: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Deposit", depositSchema);
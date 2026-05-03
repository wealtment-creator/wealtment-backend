import mongoose from "mongoose";

/*
========================================
WITHDRAWAL SCHEMA
========================================
Tracks user withdrawal requests
Admin will approve or reject
*/

const withdrawalSchema = new mongoose.Schema(
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

    walletAddress: {
      type: String,
      required: true,
    },

    amount: {
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
    isCredited: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },

    approvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Withdrawal", withdrawalSchema);
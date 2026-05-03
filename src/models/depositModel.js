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
    isDeleted: {
      type: Boolean,
      default: false,
    },

    approvedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Deposit", depositSchema);
import mongoose from "mongoose";

/*
========================================
TRANSACTION SCHEMA
========================================
Tracks deposits and withdrawals
*/

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: ["deposit", "withdrawal"],
    },

    amount: Number,

    coinType: String,

    status: String,
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
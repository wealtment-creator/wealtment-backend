import mongoose from "mongoose";

/*
========================================
PACKAGE SCHEMA
========================================
Admin creates investment packages
*/

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    minimumDeposit: {
      type: Number,
      required: true,
    },

    maximumDeposit: {
      type: Number,
      required: true,
    },

    profitPercentage: {
      type: Number,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
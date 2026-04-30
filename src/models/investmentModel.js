import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
required: true,
},

package: {
type: mongoose.Schema.Types.ObjectId,
ref: "Package",
required: true,
},

amount: {
type: Number,
required: true,
},
coinType:{
    type: String,
    enum: ["bitcoin", "litecoin"],
    required: true,
},

profitPercentage: {
type: Number,
required: true,
},

totalProfit: {
type: Number,
required: true,
},

status: {
type: String,
enum: ["active", "completed"],
default: "active",
},

startDate: {
type: Date,
default: Date.now,
},

endDate: {
type: Date,
required: true,
},

isCredited: {
type: Boolean,
default: false,
},
},
{ timestamps: true }
);

const Investment = mongoose.model("Investment", investmentSchema);

export default Investment;

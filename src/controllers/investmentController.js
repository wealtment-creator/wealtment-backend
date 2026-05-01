import Investment from "../models/investmentModel.js"
import asyncHandler from "express-async-handler";
import Package from "../models/packageModel.js";
import User from "../models/userModel.js";



export const createInvestment = asyncHandler(async (req, res) => {
const { packageId, amount, coinType } = req.body;

if (!packageId || !amount || !coinType) {
res.status(400);
throw new Error("packageId, amount and coinType are required");
}

const pkg = await Package.findById(packageId);

if (!pkg) {
res.status(404);
throw new Error("Package not found");
}

// find user
const user = await User.findById(req.user._id);

if (!user) {
res.status(404);
throw new Error("User not found");
}

// ✅ check correct wallet balance
let availableBalance = 0;

if (coinType === "bitcoin") {
availableBalance = user.btcBalance;
} else if (coinType === "litecoin") {
availableBalance = user.ltcBalance;
} else {
res.status(400);
throw new Error("Invalid coin type");
}

if (availableBalance < amount) {
res.status(400);
throw new Error("Insufficient balance");
}

// ✅ deduct from correct wallet
if (coinType === "bitcoin") {
user.btcBalance -= Number(amount);
}

if (coinType === "litecoin") {
user.ltcBalance -= Number(amount);
}

// keep total balance consistent
user.balance -= Number(amount);
await user.save();

// duration
const durationHours = parseInt(pkg.duration);

if (isNaN(durationHours)) {
res.status(400);
throw new Error("Invalid package duration. Must be a number.");
}

const startDate = new Date();
const endDate = new Date();
endDate.setHours(startDate.getHours() + durationHours);

const totalProfit = (amount * pkg.profitPercentage) / 100;

const investment = await Investment.create({
user: req.user._id,
package: pkg._id,
amount,
coinType, // ✅ NEW
profitPercentage: pkg.profitPercentage,
totalProfit,
startDate,
endDate,
});

/*
========================================
REFERRAL BONUS LOGIC (SAFE ADDITION)
========================================
*/
/*
========================================
REFERRAL BONUS LOGIC (FIXED)
========================================
*/
if (user.hasInvested === false) {
if (user.referredBy) {
const referrer = await User.findById(user.referredBy);

if (referrer) {
const bonus = Number(amount) * 0.1;

// ✅ credit correct wallet
if (coinType === "bitcoin") {
referrer.btcBalance += bonus;
}

if (coinType === "litecoin") {
referrer.ltcBalance += bonus;
}

// keep total balance
referrer.balance += bonus;
referrer.referralEarnings += bonus;

await referrer.save();
}
}

user.hasInvested = true;
await user.save();
}

res.status(201).json({
success: true,
message: "Investment created successfully",
investment,
balance: user.balance,
});
});

export const getMyInvestments = asyncHandler(async (req, res) => {
const investments = await Investment.find({
user: req.user._id,
}).populate("package");

res.json(investments);
});








import Investment from "../models/investmentModel.js"
import asyncHandler from "express-async-handler";
import Package from "../models/packageModel.js";
import User from "../models/userModel.js";

export const createInvestment = asyncHandler(async (req, res) => {
 const { packageId, amount } = req.body;

 if (!packageId || !amount) {
 res.status(400);
 throw new Error("packageId and amount are required");
 }

 const pkg = await Package.findById(packageId);

 if (!pkg) {
 res.status(404);
 throw new Error("Package not found");
 }

 // VERY IMPORTANT FIX
 const durationDays = parseInt(pkg.duration);

 if (isNaN(durationDays)) {
 res.status(400);
 throw new Error("Invalid package duration. Must be a number.");
 }

 const startDate = new Date();

 const endDate = new Date();
 endDate.setDate(startDate.getDate() + durationDays);

 const totalProfit = (amount * pkg.profitPercentage) / 100;

 const investment = await Investment.create({
 user: req.user._id,
 package: pkg._id,
 amount,
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
 const user = await User.findById(req.user._id);

 if (!user.hasInvested) {
 if (user.referredBy) {
 const referrer = await User.findById(user.referredBy);

 if (referrer) {
 const bonus = amount * 0.1; // 10%

 referrer.balance += bonus;
 referrer.referralEarnings += bonus;

 await referrer.save();
 }
 }

 // mark user as having invested
 user.hasInvested = true;
 await user.save();
 }

 res.status(201).json({
 success: true,
 investment,
 });
});

export const getMyInvestments = asyncHandler(async (req, res) => {
const investments = await Investment.find({
user: req.user._id,
}).populate("package");

res.json(investments);
});








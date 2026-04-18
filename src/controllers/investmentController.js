import Investment from "../models/investmentModel.js"
import asyncHandler from "express-async-handler";
// import Investment from "../models/investmentModel.js"
// import asyncHandler from "express-async-handler";
// import Investment from "../models/investmentModel.js";
import Package from "../models/packageModel.js";

export const createInvestment = asyncHandler(async (req, res) => {
 const { packageId, amount } = req.body;

 const pkg = await Package.findById(packageId);

 if (!pkg) {
 res.status(404);
 throw new Error("Package not found");
 }

 // calculate duration (assume days)
 const durationDays = parseInt(pkg.duration);
 const endDate = new Date();
 endDate.setDate(endDate.getDate() + durationDays);

 const totalProfit = (amount * pkg.profitPercentage) / 100;

 const investment = await Investment.create({
 user: req.user._id,
 package: pkg._id,
 amount,
 profitPercentage: pkg.profitPercentage,
 totalProfit,
 startDate: new Date(),
 endDate,
 });

 res.status(201).json(investment);
});


export const getMyInvestments = asyncHandler(async (req, res) => {
const investments = await Investment.find({
user: req.user._id,
}).populate("package");

res.json(investments);
});








import Investment from "../models/investmentModel.js"
import asyncHandler from "express-async-handler";
// import Investment from "../models/investmentModel.js"

export const createInvestment = asyncHandler(async (req, res) => {
 const { packageId } = req.body;

 const pkg = await Package.findById(packageId);
 if (!pkg) {
 res.status(404);
 throw new Error("Package not found");
 }

 const user = await User.findById(req.user._id);

 if (user.balance < pkg.price) {
 res.status(400);
 throw new Error("Insufficient balance");
 }

 // USE YOUR profitPercentage
 const totalProfit = (pkg.profitPercentage / 100) * pkg.price;

 // duration
 const endDate = new Date();
 endDate.setDate(endDate.getDate() + pkg.duration);

 // deduct balance
 user.balance -= pkg.price;
 await user.save();

 const investment = await Investment.create({
 user: user._id,
 package: pkg._id,
 amount: pkg.price,
 profitPercentage: pkg.profitPercentage,
 totalProfit,
 startDate: new Date(),
 endDate,
 });

 res.status(201).json({
 message: "Investment successful",
 investment,
 });
});

export const getMyInvestments = asyncHandler(async (req, res) => {
const investments = await Investment.find({
user: req.user._id,
}).populate("package");

res.json(investments);
});








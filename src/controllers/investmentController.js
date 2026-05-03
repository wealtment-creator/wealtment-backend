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
    throw new Error(
      coinType === "bitcoin"
        ? "Insufficient BTC balance"
        : "Insufficient LTC balance"
    );
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
    coinType,
    profitPercentage: pkg.profitPercentage,
    totalProfit,
    startDate,
    endDate,
  });

  /*
  ========================================
  REFERRAL BONUS LOGIC (PACKAGE-BASED)
  ========================================
  */
  if (user.hasInvested === false) {
    if (user.referredBy) {
      const referrer = await User.findById(user.referredBy);

      if (referrer) {
        let percentage = 0;

        const packageName = pkg.name.trim().toLowerCase();

        if (packageName === "silver") percentage = 0.06;
        else if (packageName === "gold") percentage = 0.04;
        else if (packageName === "elite") percentage = 0.03;
        else if (packageName === "diamond") percentage = 0.02;

        const bonus = Number(amount) * percentage;

        // ✅ credit correct wallet
        if (coinType === "bitcoin") {
          referrer.btcBalance += bonus;
        }

        if (coinType === "litecoin") {
          referrer.ltcBalance += bonus;
        }

        // keep total balance consistent
        referrer.balance += bonus;
        referrer.referralEarnings += bonus;

        await referrer.save();
      }
    }

    // mark first investment
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








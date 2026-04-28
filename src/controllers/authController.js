import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail, sendPasswordResetEmail, sendPasswordChangedEmail } from "../services/emailService.js";
import bcrypt from "bcryptjs";


const generateReferralCode = () => {
 return Math.random().toString(36).substring(2, 8);
};

export const signup = asyncHandler(async (req, res) => {
const {
name,
email,
password,
bitcoinAddress,
litecoinAddress,
referralCode,
} = req.body;

// Validate required fields
if (!name || !email || !password) {
res.status(400);
throw new Error("Name, email and password are required");
}

// Password must contain letters and numbers
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/;
if (!passwordRegex.test(password)) {
res.status(400);
throw new Error("Password must contain letters and numbers");
}

// Check if user already exists
const userExists = await User.findOne({ email });
if (userExists) {
res.status(400);
throw new Error("User already exists");
}

/*
========================================
REFERRAL LOOKUP (SAFE + OPTIONAL)
========================================
*/
let referrer = null;
let referrerName = "";

if (referralCode && referralCode.trim() !== "") {
console.log("Incoming referralCode:", referralCode);

referrer = await User.findOne({ referralCode });

console.log("Found referrer:", referrer);

if (!referrer) {
res.status(400);
throw new Error("Invalid referral code");
}

referrerName = referrer.name;
}

/*
========================================
CREATE USER (UPDATED)
========================================
*/
const user = await User.create({
name,
email,
password,
bitcoinAddress: bitcoinAddress || "",
litecoinAddress: litecoinAddress || "",
referralCode: generateReferralCode(),
referredBy: referrer ? referrer._id : null,
});

/*
========================================
SEND WELCOME EMAIL
========================================
*/
try {
await sendWelcomeEmail(email, name);
await sendAdminNewSignupEmail(name, email);
} catch (error) {
console.log("Email error:", error.message);
}

// Respond with user data and token
res.status(201).json({
_id: user._id,
name: user.name,
email: user.email,
role: user.role,
referralCode: user.referralCode,
referredBy: user.referredBy,
referrerName,
token: generateToken(user._id),
});
});

/*
========================================
LOGIN
========================================
POST /api/auth/login
*/
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Email and password required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // compare hashed password
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
});

/*
========================================
FORGOT PASSWORD
========================================
POST /api/auth/forgot-password
*/
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // generate token
  const resetToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  user.resetPasswordToken = resetToken;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const html = `
    <h2>Password Reset</h2>
    <p>Click link below to reset password</p>
    <a href="${resetLink}">${resetLink}</a>
  `;

try {
await sendPasswordResetEmail(user.email, user.name, resetLink);
} catch (error) {
console.log("Email error:", error.message);
}


  res.json({
    message: "Reset link sent to email",
  });
});

/*
========================================
RESET PASSWORD
========================================
POST /api/auth/reset-password
*/
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    res.status(400);
    throw new Error("Token and password required");
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    res.status(400);
    throw new Error("Invalid or expired token");
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

user.password = password;
user.resetPasswordToken = undefined;

  await user.save();
  try {
await sendPasswordChangedEmail(user.email, user.name);
} catch (error) {
console.log("Email error:", error.message);
}


  res.json({
    message: "Password reset successful",
  });
});



// //// LOGOUT


export const logoutUser = asyncHandler(async (req, res) => {
res.status(200).json({
success: true,
message: "Logout successful. Please remove token from client storage.",
});
});




/*
========================================
GET CURRENT USER (CHECK ACTIVE SESSION)
========================================
*/
export const getMe = asyncHandler(async (req, res) => {
const user = await User.findById(req.user._id).select("-password");

if (!user) {
res.status(404);
throw new Error("User not found");
}

res.json({
_id: user._id,
name: user.name,
email: user.email,
role: user.role,
balance: user.balance || 0,
});
});






// import asyncHandler from "express-async-handler";
// import User from "../models/userModel.js";
// import generateToken from "../utils/generateToken.js";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcryptjs";
// import { sendEmail } from "../utils/resend.js";

// import asyncHandler from "express-async-handler";
// import User from "../models/userModel.js";
// import generateToken from "../utils/generateToken.js";
// import { sendEmail } from "../services/emailService.js";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../services/emailService.js";

/*
========================================
SIGNUP
========================================
POST /api/auth/signup
*/
export const signup = asyncHandler(async (req, res) => {
 const { name, email, password, bitcoinAddress, litecoinAddress } = req.body;

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

 // Create new user
 const user = await User.create({
 name,
 email,
 password,
 bitcoinAddress: bitcoinAddress || "",
 litecoinAddress: litecoinAddress || "",
 });

 /*
 ========================================
 SEND WELCOME EMAIL
 ========================================
 */
 try {
 await sendWelcomeEmail(email, name);
 } catch (error) {
 console.log("Email error:", error.message);
 }

 // Respond with user data and token
 res.status(201).json({
 _id: user._id,
 name: user.name,
 email: user.email,
 role: user.role,
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

  await sendEmail({
    to: user.email,
    subject: "Password Reset Request",
    html,
  });

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

  // hash new password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.resetPasswordToken = undefined;

  await user.save();

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



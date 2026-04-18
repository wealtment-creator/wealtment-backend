import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// protect routes
export const protect = asyncHandler(async (req, res, next) => {
  // console.log("AUTH HEADER:", req.headers.authorization);
  

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    
    token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    next();

  } else {
    res.status(401);
    throw new Error("Not authorized");
  }
});

// admin only 3
export const adminOnly = (req, res, next) => {

  if (req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Admin only");
  }
};

// import jwt from "jsonwebtoken";
// import asyncHandler from "express-async-handler";
// import User from "../models/User.js";

// export const protect = asyncHandler(async (req, res, next) => {
//   const token = req.cookies.token;
//   if (!token) {
//     res.status(401);
//     throw new Error("Not authorized, no token");
//   }
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select("-password");
//     if (!req.user) {
//       res.status(401);
//       throw new Error("Not authorized, user not found");
//     }
//     next();
//   } catch {
//     res.status(401);
//     throw new Error("Not authorized, token failed");
//   }
// });

const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

exports.protect = async (req, res, next) => {
  let token;

  // Check for 'Authorization' header and format "Bearer TOKEN"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token, deny access
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    // Verify the access token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach user to the request object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    next(); // User is authenticated, proceed to the next middleware/controller
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

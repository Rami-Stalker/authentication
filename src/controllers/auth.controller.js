// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";
// import asyncHandler from "express-async-handler";

// const generateTokenAndSetCookie = (res, userId) => {
//   const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN,
//   });
//   res.cookie("token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "strict",
//     maxAge: 3600 * 1000,
//   });
// };

// export const register = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body;
//   const existing = await User.findOne({ email });
//   if (existing) {
//     res.status(400);
//     throw new Error("User already exists");
//   }
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = await User.create({ name, email, password: hashedPassword });
//   res.status(201).json({ message: "User registered", user: { _id: user._id, name, email } });
// });

// export const login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   const user = await User.findOne({ email });
//   if (!user || !(await bcrypt.compare(password, user.password))) {
//     res.status(401);
//     throw new Error("Invalid email or password");
//   }
//   generateTokenAndSetCookie(res, user._id);
//   res.json({ message: "Login successful", user: { _id: user._id, name: user.name, email } });
// });

// export const getMe = asyncHandler(async (req, res) => {
//   res.status(200).json(req.user);
// });

// export const logout = (req, res) => {
//   res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
//   res.status(200).json({ message: "Logged out" });
// };


// controllers/auth.controller.js
const User = require('../models/User.model');
const jwt = require('jsonwebtoken');

// --- Helper: Generate Tokens ---
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

// --- Helper: Send Tokens in Response ---
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in an HTTP-Only cookie for security
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents client-side JS from reading it
    secure: process.env.NODE_ENV === 'production', // Only send over HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Send access token in the response body
  res.status(statusCode).json({
    success: true,
    accessToken,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
};

// --- Register Controller ---
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'Email already in use' });
    }

    // Create new user (password will be hashed by pre-save hook)
    user = await User.create({ username, email, password });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error); // Pass to error handler
  }
};

// --- Login Controller ---
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// --- Refresh Token Controller ---
exports.refresh = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ success: false, message: 'No refresh token provided' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Token is valid, issue a new access token
    const accessToken = generateAccessToken(decoded.id);
    
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid refresh token' });
  }
};

// --- Logout Controller ---
exports.logout = (req, res) => {
  // Clear the refresh token cookie
  res.cookie('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0), // Set to a past date
  });

  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// import express from "express";
// import { register, login, logout, getMe } from "../controllers/authController.js";
// import { validate } from "../middleware/validate.js";
// import { registerSchema, loginSchema } from "../validation/authValidation.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();
// router.post("/register", validate(registerSchema), register);
// router.post("/login", validate(loginSchema), login);
// router.post("/logout", protect, logout);
// router.get("/me", protect, getMe);
// export default router;

const express = require('express');
const router = express.Router();
const { register, login, refresh, logout } = require('../controllers/auth.controller');
const { validate } = require('../middleware/validation.middleware');
const { registerSchema, loginSchema } = require('../validations/auth.validation');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(registerSchema), register);

// @route   POST /api/auth/login
// @desc    Login a user
// @access  Public
router.post('/login', validate(loginSchema), login);

// @route   POST /api/auth/refresh
// @desc    Get a new access token using a refresh token
// @access  Public (requires a valid refresh token)
router.post('/refresh', refresh);

// @route   POST /api/auth/logout
// @desc    Logout a user (invalidate refresh token)
// @access  Public (requires a valid refresh token)
router.post('/logout', logout);

module.exports = router;

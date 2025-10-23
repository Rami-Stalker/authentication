// routes/user.routes.js
const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// @route   GET /api/users/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', protect, getMe); // <-- See 'protect' middleware here

module.exports = router;
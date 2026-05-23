const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Signup Route
router.post('/signup', authController.signup);

// Login Route
router.post('/login', authController.login);

// Logout Route
router.post('/logout', authController.logout);

// Current User Details Route (Protected)
router.get('/me', verifyToken, authController.getMe);

module.exports = router;

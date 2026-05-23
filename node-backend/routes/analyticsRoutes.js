const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const analyticsController = require('../controllers/analyticsController');

// Fetch dashboard supervisor statistics (Admin Protected)
router.get('/', verifyToken, isAdmin, analyticsController.getAnalytics);

module.exports = router;

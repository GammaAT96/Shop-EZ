const express = require('express');
const { getAnalytics } = require('../controllers/analyticsController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', verifyToken, requireAdmin, getAnalytics);

module.exports = router;


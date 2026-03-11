const express = require('express');
const { getBanner, updateBanner } = require('../controllers/bannerController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', getBanner);
router.put('/update', verifyToken, requireAdmin, updateBanner);

module.exports = router;

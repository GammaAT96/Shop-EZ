const express = require('express');
const router = express.Router();
const { getBanner, updateBanner } = require('../controllers/settingsController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/banner')
    .get(getBanner)
    .put(protect, admin, updateBanner);

module.exports = router;

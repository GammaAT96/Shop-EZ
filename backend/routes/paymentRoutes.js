const express = require('express');
const router = express.Router();
const { processPayment, sendStripeApiKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/process').post(protect, processPayment);
router.route('/stripeapi').get(protect, sendStripeApiKey);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart, updateCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCart);

router.post('/add', protect, addToCart);
router.put('/update', protect, updateCartItem);
router.delete('/remove/:id', protect, removeFromCart);

module.exports = router;

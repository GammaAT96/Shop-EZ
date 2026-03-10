const express = require('express');
const router = express.Router();
const {
    addOrderItems,
    getOrderById,
    getMyOrders,
    getOrders,
    updateOrderStatus
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, addOrderItems)
    .get(protect, admin, getOrders);

router.route('/my').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);

router.route('/:id/status').patch(protect, admin, updateOrderStatus);

module.exports = router;

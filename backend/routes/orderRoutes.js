const express = require('express');
const { create, getMine, getById, cancelMine, getAll, updateStatus } = require('../controllers/orderController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/create', verifyToken, create);
router.get('/me', verifyToken, getMine);
router.get('/all', verifyToken, requireAdmin, getAll);
router.put('/status/:id', verifyToken, requireAdmin, updateStatus);
router.get('/:id', verifyToken, getById);
router.put('/:id/cancel', verifyToken, cancelMine);

module.exports = router;

const express = require('express');
const { add, getMine, remove, updateQuantity } = require('../controllers/cartController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();
router.post('/add', verifyToken, add);
router.get('/me', verifyToken, getMine);
router.patch('/:id', verifyToken, updateQuantity);
router.delete('/:id', verifyToken, remove);

module.exports = router;

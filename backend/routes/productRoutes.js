const express = require('express');
const { getAll, getById, create, update, remove } = require('../controllers/productController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', verifyToken, requireAdmin, create);
router.put('/:id', verifyToken, requireAdmin, update);
router.delete('/:id', verifyToken, requireAdmin, remove);

module.exports = router;

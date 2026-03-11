const express = require('express');
const { getAll } = require('../controllers/userController');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');

const router = express.Router();
router.get('/', verifyToken, requireAdmin, getAll);

module.exports = router;

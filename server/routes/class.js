const express = require('express');
const router = express.Router();
const { addClass, getClasses } = require('../controllers/classController');
const verifyToken = require('../middleware/auth');

router.get('/', getClasses);
router.post('/add', verifyToken, addClass);

module.exports = router;

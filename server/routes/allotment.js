const express = require('express');
const router = express.Router();
const { addAllotments, getAllotments } = require('../controllers/allotmentController');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, addAllotments); // Admin only
router.get('/', getAllotments);               // Public or student access

module.exports = router;

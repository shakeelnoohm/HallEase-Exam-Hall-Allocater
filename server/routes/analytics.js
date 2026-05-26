const express = require('express');
const router = express.Router();
const controller = require('../controllers/analyticsController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/dashboard', verifyAdmin, controller.getStats);
router.get('/conflicts', verifyAdmin, controller.getConflicts);
router.get('/export/:type', verifyAdmin, controller.exportData);

module.exports = router;

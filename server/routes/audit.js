const express = require('express');
const router = express.Router();
const controller = require('../controllers/auditController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/logs', verifyAdmin, controller.getLogs);
router.get('/stats', verifyAdmin, controller.getStats);
router.get('/history/:entity/:entityId', verifyAdmin, controller.getEntityHistory);

module.exports = router;

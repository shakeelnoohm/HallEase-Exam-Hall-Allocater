const express = require('express');
const router = express.Router();
const controller = require('../controllers/emergencyController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyStudent = require('../middleware/verifyStudent');

router.post('/broadcast', verifyAdmin, controller.createBroadcast);
router.get('/broadcasts', verifyAdmin, controller.getBroadcasts);
router.post('/acknowledge/:broadcastId', verifyStudent, controller.acknowledgeBroadcast);

module.exports = router;

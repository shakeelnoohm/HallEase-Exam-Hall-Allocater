const express = require('express');
const router = express.Router();
const controller = require('../controllers/invigilatorController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyToken = require('../middleware/auth');

// Public routes
router.post('/login', controller.login);

// Admin routes
router.post('/', verifyAdmin, controller.createInvigilator);
router.get('/', verifyAdmin, controller.getAll);
router.post('/assign', verifyAdmin, controller.assignToRoom);
router.get('/:id/roster', verifyAdmin, controller.getDutyRoster);

// Invigilator/Admin routes (mark attendance)
router.post('/attendance', verifyToken, controller.markAttendance);

module.exports = router;

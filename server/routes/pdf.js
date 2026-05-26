const express = require('express');
const router = express.Router();
const controller = require('../controllers/pdfController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyToken = require('../middleware/auth');

// Generate seating chart PDF
router.get('/seating-chart/:examId', verifyAdmin, controller.generateSeatingChart);

// Generate hall ticket PDF (accessible to student themselves or admin)
router.get('/hall-ticket/:studentId/:examId', verifyToken, controller.generateHallTicket);

// Generate QR code for student check-in
router.get('/qr/:studentId/:examId', verifyToken, controller.generateQRCode);

// Verify QR code (for invigilator scanning)
router.post('/verify-qr', verifyToken, controller.verifyQRCode);

module.exports = router;

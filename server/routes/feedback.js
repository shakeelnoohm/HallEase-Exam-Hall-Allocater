const express = require('express');
const router = express.Router();
const controller = require('../controllers/feedbackController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyStudent = require('../middleware/verifyStudent');

router.post('/', verifyStudent, controller.submitFeedback);
router.get('/stats', verifyAdmin, controller.getFeedbackStats);
router.get('/', verifyAdmin, controller.getAllFeedback);

module.exports = router;

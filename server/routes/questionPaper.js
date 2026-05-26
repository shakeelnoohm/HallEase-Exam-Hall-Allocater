const express = require('express');
const router = express.Router();
const controller = require('../controllers/questionPaperController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyInvigilator = require('../middleware/auth');

router.post('/bundle', verifyAdmin, controller.createBundle);
router.get('/bundles', verifyAdmin, controller.getBundles);
router.post('/:id/status', verifyInvigilator, controller.updateStatus);
router.post('/:id/compromise', verifyAdmin, controller.reportCompromise);
router.post('/verify', verifyInvigilator, controller.verifyBundle);

module.exports = router;

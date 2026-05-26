const express = require('express');
const router = express.Router();
const controller = require('../controllers/csvController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/template', verifyAdmin, controller.downloadTemplate);
router.post('/upload', verifyAdmin, controller.uploadMiddleware, controller.uploadStudents);

module.exports = router;

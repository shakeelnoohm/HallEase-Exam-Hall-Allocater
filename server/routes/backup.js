const express = require('express');
const router = express.Router();
const controller = require('../controllers/backupController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/', verifyAdmin, controller.createBackup);
router.get('/', verifyAdmin, controller.getBackups);
router.get('/download/:id', verifyAdmin, controller.downloadBackup);
router.post('/restore/:id', verifyAdmin, controller.restoreBackup);
router.delete('/:id', verifyAdmin, controller.deleteBackup);

module.exports = router;

const express = require('express');
const router = express.Router();
const controller = require('../controllers/roleController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/', verifyAdmin, controller.getRoles);
router.get('/:role', verifyAdmin, controller.getRole);
router.put('/:role', verifyAdmin, controller.updateRole);

module.exports = router;

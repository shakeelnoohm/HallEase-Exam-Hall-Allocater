const express = require('express');
const router = express.Router();
const controller = require('../controllers/chatController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyStudent = require('../middleware/verifyStudent');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, controller.createChat);
router.get('/my', verifyToken, controller.getMyChats);
router.get('/tickets', verifyAdmin, controller.getSupportTickets);
router.post('/:chatId/message', verifyToken, controller.sendMessage);
router.post('/:chatId/assign', verifyAdmin, controller.assignTicket);
router.post('/:chatId/resolve', verifyAdmin, controller.resolveTicket);

module.exports = router;

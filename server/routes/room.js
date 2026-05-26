const express = require('express');
const router = express.Router();
const { addRoom, getRooms, getRoomById, deleteRoom, blockSeats, unblockSeats } = require('../controllers/roomController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/add', verifyAdmin, addRoom);
router.get('/', getRooms);
router.get('/:id', getRoomById);
router.post('/:roomId/block', verifyAdmin, blockSeats);
router.post('/:roomId/unblock', verifyAdmin, unblockSeats);
router.delete('/:id', verifyAdmin, deleteRoom);

module.exports = router;

const express = require('express');
const router = express.Router();
const { addRoom, getRooms, deleteRoom } = require('../controllers/roomController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/add', verifyAdmin, addRoom);
router.get('/', getRooms);
router.delete('/:id', verifyAdmin, deleteRoom);

module.exports = router;

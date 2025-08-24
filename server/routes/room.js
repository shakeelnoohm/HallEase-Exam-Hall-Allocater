const express = require('express');
const router = express.Router();
const { addRoom, getRooms } = require('../controllers/roomController');

router.post('/add', addRoom);
router.get('/', getRooms);

module.exports = router;

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: String,
  capacity: Number
});

module.exports = mongoose.model('Room', roomSchema);

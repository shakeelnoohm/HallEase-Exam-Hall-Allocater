const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: String,
  capacity: Number,
  rows: Number,
  cols: Number,
  type: String
});

module.exports = mongoose.model('Room', roomSchema);

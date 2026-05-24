const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  rows: { type: Number, default: 5 },
  cols: { type: Number, default: 6 }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);

const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNo: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  rows: { type: Number, default: 5 },
  cols: { type: Number, default: 6 },
  blockedSeats: [{ row: Number, col: Number, reason: String }],
  floor: { type: Number, default: 1 },
  hasAccessibility: { type: Boolean, default: false },
  invigilatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Invigilator' }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);

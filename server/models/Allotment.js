const mongoose = require('mongoose');

const allotmentSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  roomNo: String,
  seatNo: String,
  examDate: Date
});

module.exports = mongoose.model('Allotment', allotmentSchema);

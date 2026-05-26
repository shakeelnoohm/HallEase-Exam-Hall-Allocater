const mongoose = require('mongoose');

const allocationVersionSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  versionName: { type: String, required: true },
  versionNumber: { type: Number, required: true },
  isDraft: { type: Boolean, default: true },
  isFinal: { type: Boolean, default: false },
  allocations: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    seatNo: String,
    row: Number,
    col: Number
  }],
  stats: {
    totalStudents: Number,
    roomsUsed: Number,
    utilizationPercent: Number
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  notes: { type: String }
}, { timestamps: true });

allocationVersionSchema.index({ examId: 1, versionNumber: -1 });

module.exports = mongoose.model('AllocationVersion', allocationVersionSchema);

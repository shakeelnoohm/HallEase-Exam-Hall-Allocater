const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  year: { type: Number, default: 1 },
  accommodations: {
    wheelchair: { type: Boolean, default: false },
    extraTime: { type: Boolean, default: false },
    scribe: { type: Boolean, default: false },
    frontRow: { type: Boolean, default: false },
    visualAid: { type: Boolean, default: false },
    hearingAid: { type: Boolean, default: false }
  },
  qrToken: { type: String },
  attendanceHistory: [{
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' },
    markedAt: { type: Date },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Invigilator' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

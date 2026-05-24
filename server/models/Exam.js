const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  title: { type: String, required: true },
  examType: { type: String, enum: ['internal', 'university'], required: true },
  subject: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  examDate: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  allocated: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Exam', examSchema);

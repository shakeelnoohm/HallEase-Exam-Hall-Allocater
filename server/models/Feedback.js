const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  allotmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Allotment' },
  ratings: {
    hallCondition: { type: Number, min: 1, max: 5 },
    seatingComfort: { type: Number, min: 1, max: 5 },
    temperature: { type: Number, min: 1, max: 5 },
    lighting: { type: Number, min: 1, max: 5 },
    overall: { type: Number, min: 1, max: 5 }
  },
  comments: { type: String },
  issues: [{
    type: { type: String, enum: ['NOISE', 'TEMPERATURE', 'BROKEN_SEAT', 'POOR_LIGHTING', 'DISTRACTION', 'OTHER'] },
    description: { type: String }
  }],
  wouldRecommend: { type: Boolean },
  submittedAt: { type: Date, default: Date.now },
  isAnonymous: { type: Boolean, default: false }
}, { timestamps: true });

feedbackSchema.index({ examId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

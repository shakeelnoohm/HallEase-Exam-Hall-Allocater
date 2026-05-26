const mongoose = require('mongoose');

const emergencyBroadcastSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['EXAM_POSTPONED', 'VENUE_CHANGE', 'TIME_CHANGE', 'WEATHER_ALERT', 'SECURITY_ALERT', 'GENERAL'], required: true },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  targetAudience: {
    allStudents: { type: Boolean, default: false },
    departments: [{ type: String }],
    semesters: [{ type: Number }],
    specificExams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exam' }],
    specificStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]
  },
  channels: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: false },
    push: { type: Boolean, default: false },
    inApp: { type: Boolean, default: true }
  },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
  sentAt: { type: Date, default: Date.now },
  deliveryStats: {
    total: { type: Number, default: 0 },
    emailSent: { type: Number, default: 0 },
    smsSent: { type: Number, default: 0 },
    pushSent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 }
  },
  acknowledgedBy: [{
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    acknowledgedAt: { type: Date }
  }],
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('EmergencyBroadcast', emergencyBroadcastSchema);

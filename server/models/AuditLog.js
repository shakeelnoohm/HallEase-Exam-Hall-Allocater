const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true, enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'EXPORT', 'ALLOCATE', 'EMAIL_SEND', 'ATTENDANCE_MARK', 'EMERGENCY_BROADCAST'] },
  entity: { type: String, required: true, enum: ['Student', 'Exam', 'Room', 'Allotment', 'Admin', 'Invigilator', 'System'] },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  description: { type: String, required: true },
  performedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId },
    userType: { type: String, enum: ['Admin', 'Invigilator', 'Student', 'System'] },
    username: { type: String }
  },
  ipAddress: { type: String },
  userAgent: { type: String },
  oldValues: { type: mongoose.Schema.Types.Mixed },
  newValues: { type: mongoose.Schema.Types.Mixed },
  metadata: { type: mongoose.Schema.Types.Mixed },
  severity: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'], default: 'INFO' }
}, { timestamps: true });

auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });
auditLogSchema.index({ 'performedBy.userId': 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);

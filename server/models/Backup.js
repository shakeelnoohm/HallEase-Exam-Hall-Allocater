const mongoose = require('mongoose');

const backupSchema = new mongoose.Schema({
  type: { type: String, enum: ['AUTOMATIC', 'MANUAL', 'SCHEDULED'], required: true },
  collections: [{ type: String }],
  filePath: { type: String },
  fileSize: { type: Number },
  recordCounts: {
    students: { type: Number, default: 0 },
    exams: { type: Number, default: 0 },
    rooms: { type: Number, default: 0 },
    allotments: { type: Number, default: 0 }
  },
  checksum: { type: String },
  status: { type: String, enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  errorMessage: { type: String },
  triggeredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  completedAt: { type: Date },
  retentionUntil: { type: Date },
  isRestored: { type: Boolean, default: false },
  restoredAt: { type: Date },
  cloudUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Backup', backupSchema);

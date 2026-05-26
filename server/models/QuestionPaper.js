const mongoose = require('mongoose');

const questionPaperSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  bundleCode: { type: String, required: true, unique: true },
  sealNumber: { type: String, required: true },
  packetCount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['IN_VAULT', 'IN_TRANSIT', 'RECEIVED_AT_HALL', 'DISTRIBUTED', 'COLLECTED', 'RETURNED_TO_VAULT'],
    default: 'IN_VAULT'
  },
  custodyChain: [{
    status: { type: String, enum: ['IN_VAULT', 'IN_TRANSIT', 'RECEIVED_AT_HALL', 'DISTRIBUTED', 'COLLECTED', 'RETURNED_TO_VAULT'] },
    handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Invigilator' },
    handledAt: { type: Date, default: Date.now },
    location: { type: String },
    notes: { type: String },
    signature: { type: String }
  }],
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Invigilator' },
  receivedAt: { type: Date },
  distributedAt: { type: Date },
  collectedAt: { type: Date },
  returnedAt: { type: Date },
  isCompromised: { type: Boolean, default: false },
  compromiseReport: { type: String }
}, { timestamps: true });

questionPaperSchema.index({ examId: 1, roomId: 1 });
questionPaperSchema.index({ bundleCode: 1 });

module.exports = mongoose.model('QuestionPaper', questionPaperSchema);

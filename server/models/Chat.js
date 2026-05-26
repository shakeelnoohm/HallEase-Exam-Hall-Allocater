const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  type: { type: String, enum: ['SUPPORT', 'ANNOUNCEMENT', 'PRIVATE'], default: 'SUPPORT' },
  participants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userType: { type: String, enum: ['Student', 'Admin', 'Invigilator'], required: true },
    name: { type: String }
  }],
  messages: [{
    sender: {
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      userType: { type: String, enum: ['Student', 'Admin', 'Invigilator', 'SYSTEM'], required: true },
      name: { type: String }
    },
    content: { type: String, required: true },
    attachments: [{ type: String }],
    sentAt: { type: Date, default: Date.now },
    readBy: [{ userId: mongoose.Schema.Types.ObjectId, readAt: Date }],
    isDeleted: { type: Boolean, default: false }
  }],
  relatedTo: {
    entity: { type: String, enum: ['Exam', 'Allotment', 'General'] },
    entityId: { type: mongoose.Schema.Types.ObjectId }
  },
  status: { type: String, enum: ['OPEN', 'RESOLVED', 'CLOSED'], default: 'OPEN' },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  tags: [{ type: String }],
  resolvedAt: { type: Date },
  lastActivityAt: { type: Date, default: Date.now }
}, { timestamps: true });

chatSchema.index({ 'participants.userId': 1, lastActivityAt: -1 });
chatSchema.index({ status: 1, priority: -1 });

module.exports = mongoose.model('Chat', chatSchema);

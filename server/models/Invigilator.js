const mongoose = require('mongoose');

const invigilatorSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  phone: { type: String, trim: true },
  department: { type: String, trim: true },
  employeeId: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['invigilator', 'supervisor'], default: 'invigilator' },
  assignedRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
  dutyHistory: [{
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    date: Date,
    status: { type: String, enum: ['assigned', 'completed', 'cancelled'], default: 'assigned' }
  }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Invigilator', invigilatorSchema);

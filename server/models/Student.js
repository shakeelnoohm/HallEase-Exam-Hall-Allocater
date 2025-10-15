const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rollNo: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    minlength: 7 // optional security measure
  },
  department: {
    type: String,
    required: true
  },
  semester: {
    type: Number,
    required: true
  },
  exams: {
    type: [String],
    default: []
  },
  hallAllocation: {
    room: {
      type: String
    },
    seatNo: {
      type: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

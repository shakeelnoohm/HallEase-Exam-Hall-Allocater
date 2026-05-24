const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  rollNo: { type: String, required: true, unique: true, trim: true },
  email: { type: String, trim: true, required: true },
  password: { type: String, required: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  year: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);

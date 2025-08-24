const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  department: String,
  semester: Number,
  subject: String,
  examDate: Date
});

module.exports = mongoose.model('Class', classSchema);

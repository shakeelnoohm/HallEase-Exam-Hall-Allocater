const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  department: String,
  semester: String,
  subject: String,
  examDate: Date
});

module.exports = mongoose.model('Class', classSchema);

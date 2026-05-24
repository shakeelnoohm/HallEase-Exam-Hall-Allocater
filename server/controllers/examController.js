const Exam = require('../models/Exam');

exports.createExam = async (req, res) => {
  try {
    const { title, examType, subject, department, semester, examDate, startTime, endTime } = req.body;
    if (!title || !examType || !subject || !department || !semester || !examDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const exam = new Exam({ title, examType, subject, department, semester, examDate, startTime, endTime });
    await exam.save();
    res.status(201).json({ message: 'Exam created successfully', exam });
  } catch (error) {
    res.status(500).json({ message: 'Error creating exam', error: error.message });
  }
};

exports.getExams = async (req, res) => {
  try {
    const exams = await Exam.find().sort({ examDate: 1 });
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exams', error: error.message });
  }
};

exports.getExamById = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exam', error: error.message });
  }
};

exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam updated', exam });
  } catch (error) {
    res.status(500).json({ message: 'Error updating exam', error: error.message });
  }
};

exports.deleteExam = async (req, res) => {
  try {
    await Exam.findByIdAndDelete(req.params.id);
    res.json({ message: 'Exam deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exam', error: error.message });
  }
};

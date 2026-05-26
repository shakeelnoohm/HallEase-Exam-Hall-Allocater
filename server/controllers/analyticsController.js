const { getDashboardStats, detectExamConflicts } = require('../utils/analytics');
const { Parser } = require('@json2csv/plainjs');

exports.getStats = async (req, res) => {
  try {
    const stats = await getDashboardStats();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getConflicts = async (req, res) => {
  try {
    const conflicts = await detectExamConflicts();
    res.json({ conflicts, count: conflicts.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.exportData = async (req, res) => {
  try {
    const { type } = req.params;
    const { examId, format = 'csv' } = req.query;
    
    let data = [];
    let fields = [];
    let filename = '';
    
    switch (type) {
      case 'students':
        const Student = require('../models/Student');
        data = await Student.find().select('-password -qrToken').lean();
        fields = ['name', 'rollNo', 'email', 'department', 'semester', 'year'];
        filename = 'students_export.csv';
        break;
        
      case 'exams':
        const Exam = require('../models/Exam');
        data = await Exam.find().lean();
        fields = ['title', 'examType', 'subject', 'department', 'semester', 'examDate', 'startTime', 'endTime', 'allocated'];
        filename = 'exams_export.csv';
        break;
        
      case 'allotments':
        const Allotment = require('../models/Allotment');
        const query = examId ? { examId } : {};
        data = await Allotment.find(query)
          .populate('studentId', 'name rollNo department semester email')
          .populate('examId', 'title subject examDate')
          .populate('roomId', 'roomNo')
          .lean();
        
        data = data.map(a => ({
          studentName: a.studentId?.name,
          rollNo: a.studentId?.rollNo,
          department: a.studentId?.department,
          semester: a.studentId?.semester,
          email: a.studentId?.email,
          exam: a.examId?.title,
          subject: a.examId?.subject,
          examDate: a.examId?.examDate,
          hall: a.roomId?.roomNo,
          seat: a.seatNo,
          emailSent: a.emailSent
        }));
        
        fields = ['studentName', 'rollNo', 'department', 'semester', 'email', 'exam', 'subject', 'examDate', 'hall', 'seat', 'emailSent'];
        filename = examId ? `allotments_exam_${examId}.csv` : 'all_allotments.csv';
        break;
        
      default:
        return res.status(400).json({ message: 'Invalid export type' });
    }
    
    if (format === 'csv') {
      const parser = new Parser({ fields });
      const csv = parser.parse(data);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.send(csv);
    } else if (format === 'json') {
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

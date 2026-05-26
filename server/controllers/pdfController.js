const { generateSeatingChartPDF, generateHallTicketPDF } = require('../utils/pdfGenerator');
const Allotment = require('../models/Allotment');
const Exam = require('../models/Exam');
const Room = require('../models/Room');
const Student = require('../models/Student');
const { generateStudentQR } = require('../utils/qrGenerator');

// Generate seating chart PDF for an exam
exports.generateSeatingChart = async (req, res) => {
  try {
    const { examId } = req.params;
    
    const exam = await Exam.findById(examId);
    if (!exam) {
      return res.status(404).json({ message: 'Exam not found' });
    }
    
    const allotments = await Allotment.find({ examId })
      .populate('studentId', 'name rollNo department semester accommodations')
      .populate('roomId', 'roomNo capacity rows cols')
      .sort({ seatNo: 1 });
    
    const roomIds = [...new Set(allotments.map(a => a.roomId?._id?.toString()))];
    const rooms = await Room.find({ _id: { $in: roomIds } });
    
    const pdfBuffer = generateSeatingChartPDF(exam, allotments, rooms);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=seating_chart_${examId}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate hall ticket PDF for a student
exports.generateHallTicket = async (req, res) => {
  try {
    const { studentId, examId } = req.params;
    
    const [student, exam, allotment] = await Promise.all([
      Student.findById(studentId),
      Exam.findById(examId),
      Allotment.findOne({ studentId, examId })
        .populate('roomId', 'roomNo')
    ]);
    
    if (!student || !exam) {
      return res.status(404).json({ message: 'Student or exam not found' });
    }
    
    if (!allotment) {
      return res.status(404).json({ message: 'No allotment found for this student and exam' });
    }
    
    const pdfBuffer = generateHallTicketPDF(student, exam, allotment);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=hall_ticket_${student.rollNo}.pdf`);
    res.send(pdfBuffer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate QR code for check-in
exports.generateQRCode = async (req, res) => {
  try {
    const { studentId, examId } = req.params;
    
    const allotment = await Allotment.findOne({ studentId, examId })
      .populate('studentId', 'name rollNo')
      .populate('roomId', 'roomNo');
    
    if (!allotment) {
      return res.status(404).json({ message: 'Allotment not found' });
    }
    
    const { token, dataUrl } = await generateStudentQR(
      studentId,
      examId,
      { seatNo: allotment.seatNo, roomNo: allotment.roomId?.roomNo }
    );
    
    // Save QR token to student
    await Student.findByIdAndUpdate(studentId, { qrToken: token });
    
    res.json({ qrCode: dataUrl, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Verify QR code (for invigilator scan)
exports.verifyQRCode = async (req, res) => {
  try {
    const { token } = req.body;
    const { verifyQRToken } = require('../utils/qrGenerator');
    
    const decoded = verifyQRToken(token);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired QR code' });
    }
    
    const { studentId, examId, seatNo } = decoded;
    
    // Verify student and exam
    const [student, exam, allotment] = await Promise.all([
      Student.findById(studentId).select('name rollNo department semester'),
      Exam.findById(examId).select('title subject examDate startTime endTime'),
      Allotment.findOne({ studentId, examId }).populate('roomId', 'roomNo')
    ]);
    
    if (!student || !exam || !allotment) {
      return res.status(404).json({ message: 'Invalid allotment data' });
    }
    
    // Verify seat matches
    if (allotment.seatNo !== seatNo) {
      return res.status(400).json({ message: 'Seat mismatch - possible fraud attempt' });
    }
    
    res.json({
      valid: true,
      student,
      exam,
      allotment: {
        seatNo: allotment.seatNo,
        roomNo: allotment.roomId?.roomNo
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

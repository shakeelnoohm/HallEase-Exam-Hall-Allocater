const Student = require('../models/Student');
const Room = require('../models/Room');
const Exam = require('../models/Exam');
const Allotment = require('../models/Allotment');
const generateAllotments = require('../utils/allocationLogic');
const { sendAllotmentEmail } = require('../utils/mailer');

exports.allocateExam = async (req, res) => {
  const { examId, roomIds, sendEmails } = req.body;

  try {
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    if (exam.allocated) {
      return res.status(400).json({ message: 'Allotments already generated for this exam. Delete existing allotments first.' });
    }

    const students = await Student.find({ department: exam.department, semester: exam.semester });
    if (!students.length) return res.status(400).json({ message: 'No students found for this exam department/semester' });

    let rooms;
    if (roomIds && roomIds.length > 0) {
      rooms = await Room.find({ _id: { $in: roomIds } });
    } else {
      rooms = await Room.find().sort({ capacity: -1 });
    }
    if (!rooms.length) return res.status(400).json({ message: 'No rooms available' });

    const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);
    if (totalCapacity < students.length) {
      return res.status(400).json({ message: `Not enough capacity. Need ${students.length} seats, have ${totalCapacity}` });
    }

    const allotments = await generateAllotments(students, rooms, examId);

    await Exam.findByIdAndUpdate(examId, { allocated: true });

    if (sendEmails) {
      const populated = await Allotment.find({ examId })
        .populate('studentId')
        .populate('roomId');

      let emailsSent = 0;
      for (const allot of populated) {
        try {
          await sendAllotmentEmail({
            to: allot.studentId.email,
            studentName: allot.studentId.name,
            examTitle: exam.title,
            examType: exam.examType,
            subject: exam.subject,
            examDate: exam.examDate,
            startTime: exam.startTime,
            endTime: exam.endTime,
            roomNo: allot.roomId.roomNo,
            seatNo: allot.seatNo,
            department: exam.department,
            semester: exam.semester
          });
          await Allotment.findByIdAndUpdate(allot._id, { emailSent: true });
          emailsSent++;
        } catch (emailErr) {
          console.error(`Email failed for ${allot.studentId.email}:`, emailErr.message);
        }
      }
      return res.status(201).json({ message: `Allotments created. ${emailsSent}/${students.length} emails sent.`, count: allotments.length });
    }

    res.status(201).json({ message: 'Allotments created successfully', count: allotments.length });
  } catch (error) {
    res.status(500).json({ message: 'Error creating allotments', error: error.message });
  }
};

exports.sendExamEmails = async (req, res) => {
  const { examId } = req.params;
  try {
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const allotments = await Allotment.find({ examId }).populate('studentId').populate('roomId');
    if (!allotments.length) return res.status(400).json({ message: 'No allotments found for this exam' });

    let emailsSent = 0;
    for (const allot of allotments) {
      try {
        await sendAllotmentEmail({
          to: allot.studentId.email,
          studentName: allot.studentId.name,
          examTitle: exam.title,
          examType: exam.examType,
          subject: exam.subject,
          examDate: exam.examDate,
          startTime: exam.startTime,
          endTime: exam.endTime,
          roomNo: allot.roomId.roomNo,
          seatNo: allot.seatNo,
          department: exam.department,
          semester: exam.semester
        });
        await Allotment.findByIdAndUpdate(allot._id, { emailSent: true });
        emailsSent++;
      } catch (emailErr) {
        console.error(`Email failed for ${allot.studentId.email}:`, emailErr.message);
      }
    }
    res.json({ message: `${emailsSent}/${allotments.length} emails sent` });
  } catch (error) {
    res.status(500).json({ message: 'Error sending emails', error: error.message });
  }
};

exports.getAllotmentsByExam = async (req, res) => {
  try {
    const allotments = await Allotment.find({ examId: req.params.examId })
      .populate('studentId', '-password')
      .populate('roomId')
      .populate('examId');
    res.json(allotments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching allotments', error: error.message });
  }
};

exports.getMyAllotments = async (req, res) => {
  try {
    const studentId = req.student.id;
    const allotments = await Allotment.find({ studentId })
      .populate('examId')
      .populate('roomId');
    res.json(allotments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your allotments', error: error.message });
  }
};

exports.deleteExamAllotments = async (req, res) => {
  try {
    await Allotment.deleteMany({ examId: req.params.examId });
    await Exam.findByIdAndUpdate(req.params.examId, { allocated: false });
    res.json({ message: 'Allotments deleted and exam reset' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting allotments', error: error.message });
  }
};

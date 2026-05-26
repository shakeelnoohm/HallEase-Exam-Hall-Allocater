const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Invigilator = require('../models/Invigilator');
const Room = require('../models/Room');
const Exam = require('../models/Exam');

// Create invigilator
exports.createInvigilator = async (req, res) => {
  try {
    const { name, email, phone, department, employeeId, password, role } = req.body;
    
    const existing = await Invigilator.findOne({ $or: [{ email }, { employeeId }] });
    if (existing) {
      return res.status(400).json({ message: 'Email or Employee ID already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const invigilator = new Invigilator({
      name,
      email,
      phone,
      department,
      employeeId,
      password: hashedPassword,
      role: role || 'invigilator'
    });
    
    await invigilator.save();
    res.status(201).json({ message: 'Invigilator created', invigilator: { name, email, role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const invigilator = await Invigilator.findOne({ email });
    if (!invigilator) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, invigilator.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    if (!invigilator.isActive) {
      return res.status(403).json({ message: 'Account deactivated' });
    }
    
    const token = jwt.sign(
      { id: invigilator._id, role: invigilator.role, type: 'invigilator' },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );
    
    res.json({
      token,
      invigilator: {
        id: invigilator._id,
        name: invigilator.name,
        email: invigilator.email,
        role: invigilator.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all invigilators
exports.getAll = async (req, res) => {
  try {
    const invigilators = await Invigilator.find({ isActive: true })
      .select('-password')
      .populate('assignedRooms', 'roomNo');
    res.json(invigilators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Assign invigilator to room
exports.assignToRoom = async (req, res) => {
  try {
    const { invigilatorId, roomId } = req.body;
    
    const invigilator = await Invigilator.findById(invigilatorId);
    if (!invigilator) {
      return res.status(404).json({ message: 'Invigilator not found' });
    }
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Add to assigned rooms if not already assigned
    if (!invigilator.assignedRooms.includes(roomId)) {
      invigilator.assignedRooms.push(roomId);
    }
    
    // Update room with invigilator
    room.invigilatorId = invigilatorId;
    
    await Promise.all([invigilator.save(), room.save()]);
    
    res.json({ message: `Invigilator assigned to ${room.roomNo}` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get invigilator's duty roster
exports.getDutyRoster = async (req, res) => {
  try {
    const { id } = req.params;
    
    const invigilator = await Invigilator.findById(id)
      .populate('dutyHistory.examId', 'title subject examDate startTime endTime')
      .populate('dutyHistory.roomId', 'roomNo');
    
    if (!invigilator) {
      return res.status(404).json({ message: 'Invigilator not found' });
    }
    
    res.json(invigilator.dutyHistory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, examId, status } = req.body;
    const invigilatorId = req.invigilator?.id || req.body.invigilatorId;
    
    const Student = require('../models/Student');
    const student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Update or add attendance record
    const existingIndex = student.attendanceHistory.findIndex(
      h => h.examId.toString() === examId
    );
    
    const record = {
      examId,
      status,
      markedAt: new Date(),
      markedBy: invigilatorId
    };
    
    if (existingIndex >= 0) {
      student.attendanceHistory[existingIndex] = record;
    } else {
      student.attendanceHistory.push(record);
    }
    
    await student.save();
    
    res.json({ message: 'Attendance marked', student: student.rollNo, status });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

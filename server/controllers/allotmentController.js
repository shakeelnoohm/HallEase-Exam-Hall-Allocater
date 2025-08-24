const Student = require('../models/Student');
const Room = require('../models/Room');
const generateAllotments = require('../utils/allocationLogic');

exports.addAllotments = async (req, res) => {
  const { department, semester, examDate } = req.body;

  try {
    const students = await Student.find({ department, semester });
    const rooms = await Room.find();

    if (!students.length || !rooms.length)
      return res.status(400).json({ message: 'Not enough students or rooms' });

    await generateAllotments(students, rooms, examDate);

    res.status(201).json({ message: 'Allotments created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating allotments', error: error.message });
  }
};

exports.getAllotments = async (req, res) => {
  try {
    const allotments = await Allotment.find().populate('studentId');
    res.json(allotments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching allotments', error: error.message });
  }
};

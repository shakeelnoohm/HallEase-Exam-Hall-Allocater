const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

exports.addStudent = async (req, res) => {
  try {
    const { name, rollNo, email, password, department, semester, year } = req.body;
    if (!name || !rollNo || !email || !password || !department || !semester) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = new Student({ name, rollNo, email, password: hashedPassword, department, semester, year: year || 1 });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: { ...newStudent.toObject(), password: undefined } });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const filter = {};
    if (req.query.department) filter.department = req.query.department;
    if (req.query.semester) filter.semester = Number(req.query.semester);
    const students = await Student.find(filter).select('-password');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: 'Student deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

exports.studentLogin = async (req, res) => {
  const { rollNo, password } = req.body;
  try {
    const student = await Student.findOne({ rollNo });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: student._id, role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({
      token,
      student: {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        email: student.email,
        department: student.department,
        semester: student.semester,
        year: student.year
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

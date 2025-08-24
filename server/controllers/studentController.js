const Student = require('../models/Student');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Add a new student (with hashed password)
exports.addStudent = async (req, res) => {
  try {
    const { name, rollNo, email, password, department, semester, exams, hallAllocation } = req.body;

    // Check if roll number already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newStudent = new Student({
      name,
      rollNo,
      email,
      password: hashedPassword,
      department,
      semester,
      exams,
      hallAllocation
    });

    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully', student: newStudent });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
};

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().select('-password'); // hide password in response
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
};

// Student login with rollNo + password
exports.studentLogin = async (req, res) => {
  const { rollNo, password } = req.body;
  try {
    const student = await Student.findOne({ rollNo });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: student._id, role: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      student: {
        _id: student._id,
        name: student.name,
        rollNo: student.rollNo,
        email: student.email,
        department: student.department,
        semester: student.semester,
        exams: student.exams,
        hallAllocation: student.hallAllocation
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login error', error: error.message });
  }
};

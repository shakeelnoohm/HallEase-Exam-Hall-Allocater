const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { parseStudentCSV, generateStudentTemplate } = require('../utils/csvImporter');
const Student = require('../models/Student');

// Multer config for CSV upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `students_${Date.now()}.csv`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files allowed'));
    }
  }
});

exports.uploadMiddleware = upload.single('file');

// Upload and process CSV
exports.uploadStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const { students, errors } = await parseStudentCSV(req.file.path);
    
    // Delete temp file
    fs.unlinkSync(req.file.path);
    
    if (students.length === 0) {
      return res.status(400).json({ message: 'No valid students found in CSV', errors });
    }
    
    // Check for duplicates
    const rollNos = students.map(s => s.rollNo);
    const existing = await Student.find({ rollNo: { $in: rollNos } }).select('rollNo');
    const existingRollNos = new Set(existing.map(e => e.rollNo));
    
    const newStudents = [];
    const duplicates = [];
    
    for (const student of students) {
      if (existingRollNos.has(student.rollNo)) {
        duplicates.push(student.rollNo);
      } else {
        // Hash password
        student.password = await bcrypt.hash(student.password, 10);
        newStudents.push(student);
      }
    }
    
    // Insert new students
    let inserted = 0;
    if (newStudents.length > 0) {
      const result = await Student.insertMany(newStudents, { ordered: false });
      inserted = result.length;
    }
    
    res.json({
      message: `Imported ${inserted} students`,
      inserted,
      duplicates: duplicates.length,
      duplicateRollNos: duplicates,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: err.message });
  }
};

// Download CSV template
exports.downloadTemplate = (req, res) => {
  const csv = generateStudentTemplate();
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=student_template.csv');
  res.send(csv);
};

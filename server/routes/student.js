const express = require('express');
const router = express.Router();
const { addStudent, getStudents, studentLogin } = require('../controllers/studentController');

router.post('/add', addStudent);
router.get('/', getStudents);
router.post('/login', studentLogin);
const verifyStudent = require('../middleware/verifyStudent');


router.get('/dashboard', verifyStudent, async (req, res) => {
  res.json({ message: `Welcome student ${req.student.id}` });
});

module.exports = router;

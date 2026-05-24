const express = require('express');
const router = express.Router();
const { addStudent, getStudents, studentLogin, getMe, deleteStudent } = require('../controllers/studentController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyStudent = require('../middleware/verifyStudent');

router.post('/login', studentLogin);
router.get('/me', verifyStudent, getMe);
router.post('/add', verifyAdmin, addStudent);
router.get('/', verifyAdmin, getStudents);
router.delete('/:id', verifyAdmin, deleteStudent);

module.exports = router;

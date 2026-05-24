const express = require('express');
const router = express.Router();
const { createExam, getExams, getExamById, updateExam, deleteExam } = require('../controllers/examController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.post('/', verifyAdmin, createExam);
router.get('/', getExams);
router.get('/:id', getExamById);
router.put('/:id', verifyAdmin, updateExam);
router.delete('/:id', verifyAdmin, deleteExam);

module.exports = router;

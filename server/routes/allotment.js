const express = require('express');
const router = express.Router();
const {
  allocateExam,
  sendExamEmails,
  getAllotmentsByExam,
  getMyAllotments,
  deleteExamAllotments
} = require('../controllers/allotmentController');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyStudent = require('../middleware/verifyStudent');

router.post('/allocate', verifyAdmin, allocateExam);
router.post('/send-emails/:examId', verifyAdmin, sendExamEmails);
router.get('/exam/:examId', verifyAdmin, getAllotmentsByExam);
router.get('/my', verifyStudent, getMyAllotments);
router.delete('/exam/:examId', verifyAdmin, deleteExamAllotments);

module.exports = router;

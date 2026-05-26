const Exam = require('../models/Exam');
const Room = require('../models/Room');
const Student = require('../models/Student');
const Allotment = require('../models/Allotment');

/**
 * Get comprehensive analytics for the dashboard
 */
async function getDashboardStats() {
  const [
    totalStudents,
    totalRooms,
    totalExams,
    upcomingExams,
    internalExams,
    universityExams,
    allocatedExams,
    recentAllotments
  ] = await Promise.all([
    Student.countDocuments(),
    Room.countDocuments(),
    Exam.countDocuments(),
    Exam.countDocuments({ examDate: { $gte: new Date() } }),
    Exam.countDocuments({ examType: 'internal' }),
    Exam.countDocuments({ examType: 'university' }),
    Exam.countDocuments({ allocated: true }),
    Allotment.countDocuments()
  ]);
  
  // Department distribution
  const deptDistribution = await Student.aggregate([
    { $group: { _id: '$department', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  
  // Room utilization (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const roomUtilization = await Allotment.aggregate([
    {
      $lookup: {
        from: 'exams',
        localField: 'examId',
        foreignField: '_id',
        as: 'exam'
      }
    },
    { $unwind: '$exam' },
    { $match: { 'exam.examDate': { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: '$roomId',
        usageCount: { $sum: 1 },
        totalStudents: { $sum: 1 }
      }
    },
    {
      $lookup: {
        from: 'rooms',
        localField: '_id',
        foreignField: '_id',
        as: 'room'
      }
    },
    { $unwind: '$room' },
    {
      $project: {
        roomNo: '$room.roomNo',
        capacity: '$room.capacity',
        usageCount: 1,
        totalStudents: 1,
        utilizationRate: { $multiply: [{ $divide: ['$totalStudents', '$room.capacity'] }, 100] }
      }
    }
  ]);
  
  // Peak exam days (next 30 days)
  const nextThirtyDays = new Date();
  nextThirtyDays.setDate(nextThirtyDays.getDate() + 30);
  
  const peakDays = await Exam.aggregate([
    {
      $match: {
        examDate: { $gte: new Date(), $lte: nextThirtyDays }
      }
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$examDate' } },
        examCount: { $sum: 1 },
        totalStudents: { $sum: 1 } // Approximate
      }
    },
    { $sort: { examCount: -1 } },
    { $limit: 7 }
  ]);
  
  // Special accommodations count
  const accommodations = await Student.aggregate([
    {
      $group: {
        _id: null,
        wheelchair: { $sum: { $cond: ['$accommodations.wheelchair', 1, 0] } },
        extraTime: { $sum: { $cond: ['$accommodations.extraTime', 1, 0] } },
        scribe: { $sum: { $cond: ['$accommodations.scribe', 1, 0] } },
        frontRow: { $sum: { $cond: ['$accommodations.frontRow', 1, 0] } }
      }
    }
  ]);
  
  return {
    overview: {
      totalStudents,
      totalRooms,
      totalExams,
      upcomingExams,
      internalExams,
      universityExams,
      allocatedExams,
      recentAllotments
    },
    deptDistribution,
    roomUtilization,
    peakDays,
    accommodations: accommodations[0] || { wheelchair: 0, extraTime: 0, scribe: 0, frontRow: 0 }
  };
}

/**
 * Check for exam conflicts (same student, overlapping times)
 */
async function detectExamConflicts() {
  const conflicts = [];
  
  // Get all upcoming exams
  const exams = await Exam.find({ examDate: { $gte: new Date() } }).lean();
  
  for (const exam of exams) {
    // Get students assigned to this exam
    const allotments = await Allotment.find({ examId: exam._id })
      .populate('studentId', 'name rollNo')
      .lean();
    
    const studentIds = allotments.map(a => a.studentId._id.toString());
    
    // Check for other exams on same day with overlapping times
    const sameDayExams = await Exam.find({
      _id: { $ne: exam._id },
      examDate: {
        $gte: new Date(exam.examDate.setHours(0, 0, 0, 0)),
        $lt: new Date(exam.examDate.setHours(23, 59, 59, 999))
      }
    }).lean();
    
    for (const otherExam of sameDayExams) {
      // Check if times overlap
      const start1 = parseTime(exam.startTime);
      const end1 = parseTime(exam.endTime);
      const start2 = parseTime(otherExam.startTime);
      const end2 = parseTime(otherExam.endTime);
      
      if (timesOverlap(start1, end1, start2, end2)) {
        // Check for overlapping students
        const otherAllotments = await Allotment.find({
          examId: otherExam._id,
          studentId: { $in: studentIds }
        }).populate('studentId', 'name rollNo').lean();
        
        if (otherAllotments.length > 0) {
          conflicts.push({
            exam1: { title: exam.title, time: `${exam.startTime}-${exam.endTime}` },
            exam2: { title: otherExam.title, time: `${otherExam.startTime}-${otherExam.endTime}` },
            students: otherAllotments.map(a => ({
              name: a.studentId.name,
              rollNo: a.studentId.rollNo
            }))
          });
        }
      }
    }
  }
  
  return conflicts;
}

function parseTime(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function timesOverlap(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

module.exports = {
  getDashboardStats,
  detectExamConflicts
};

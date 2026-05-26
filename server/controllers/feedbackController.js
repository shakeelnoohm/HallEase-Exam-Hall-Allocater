const Feedback = require('../models/Feedback');
const Room = require('../models/Room');

exports.submitFeedback = async (req, res) => {
  try {
    const { examId, allotmentId, ratings, comments, issues, isAnonymous } = req.body;
    const studentId = req.student.id;
    
    const existing = await Feedback.findOne({ examId, studentId });
    if (existing) {
      return res.status(400).json({ message: 'Feedback already submitted for this exam' });
    }
    
    const feedback = new Feedback({
      examId,
      studentId,
      allotmentId,
      ratings,
      comments,
      issues,
      isAnonymous
    });
    
    await feedback.save();
    
    // If issues reported, flag room for maintenance
    if (issues && issues.length > 0) {
      const allotment = await Allotment.findById(allotmentId);
      if (allotment) {
        await Room.findByIdAndUpdate(allotment.roomId, {
          $push: {
            maintenanceFlags: {
              issues: issues.map(i => i.type),
              reportedAt: new Date(),
              feedbackId: feedback._id
            }
          }
        });
      }
    }
    
    res.json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getFeedbackStats = async (req, res) => {
  try {
    const { examId, roomId } = req.query;
    
    const match = {};
    if (examId) match.examId = new mongoose.Types.ObjectId(examId);
    
    const stats = await Feedback.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          avgHallCondition: { $avg: '$ratings.hallCondition' },
          avgSeatingComfort: { $avg: '$ratings.seatingComfort' },
          avgTemperature: { $avg: '$ratings.temperature' },
          avgLighting: { $avg: '$ratings.lighting' },
          avgOverall: { $avg: '$ratings.overall' },
          totalResponses: { $sum: 1 },
          wouldRecommend: {
            $sum: { $cond: ['$wouldRecommend', 1, 0] }
          }
        }
      }
    ]);
    
    const issueStats = await Feedback.aggregate([
      { $match: match },
      { $unwind: '$issues' },
      {
        $group: {
          _id: '$issues.type',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json({
      ratings: stats[0] || {},
      issues: issueStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllFeedback = async (req, res) => {
  try {
    const { examId, page = 1, limit = 50 } = req.query;
    
    const filter = {};
    if (examId) filter.examId = examId;
    
    const feedback = await Feedback.find(filter)
      .populate('examId', 'title subject')
      .populate('studentId', 'name department', null, { 
        transform: (doc) => doc.isAnonymous ? null : doc 
      })
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

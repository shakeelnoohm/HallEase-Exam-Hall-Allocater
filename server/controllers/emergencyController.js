const EmergencyBroadcast = require('../models/EmergencyBroadcast');
const Student = require('../models/Student');
const { sendExamAllocationEmail } = require('../utils/mailer');
const { logAction } = require('../utils/auditLogger');

exports.createBroadcast = async (req, res) => {
  try {
    const { title, message, type, priority, targetAudience, channels } = req.body;
    
    const broadcast = new EmergencyBroadcast({
      title,
      message,
      type,
      priority,
      targetAudience,
      channels,
      sentBy: req.admin.id
    });
    
    await broadcast.save();
    
    // Find target students
    let studentQuery = {};
    if (!targetAudience.allStudents) {
      if (targetAudience.departments?.length > 0) {
        studentQuery.department = { $in: targetAudience.departments };
      }
      if (targetAudience.semesters?.length > 0) {
        studentQuery.semester = { $in: targetAudience.semesters };
      }
      if (targetAudience.specificStudents?.length > 0) {
        studentQuery._id = { $in: targetAudience.specificStudents };
      }
    }
    
    const students = await Student.find(studentQuery);
    
    // Send notifications (Email only - SMS disabled)
    let emailSent = 0, failed = 0;
    
    for (const student of students) {
      try {
        if (channels.email && student.email) {
          await sendExamAllocationEmail(student, { title: message, examDate: new Date() }, { seatNo: 'N/A' });
          emailSent++;
        }
      } catch (err) {
        failed++;
        console.error(`Failed to notify ${student._id}:`, err);
      }
    }
    
    broadcast.deliveryStats = {
      total: students.length,
      emailSent,
      smsSent: 0,
      failed
    };
    await broadcast.save();
    
    await logAction({
      action: 'EMERGENCY_BROADCAST',
      entity: 'System',
      description: `Emergency broadcast: ${title}`,
      performedBy: { userId: req.admin.id, userType: 'Admin', username: req.admin.username },
      severity: priority === 'CRITICAL' ? 'CRITICAL' : 'WARNING'
    });
    
    res.json({
      message: 'Emergency broadcast sent',
      broadcast,
      stats: broadcast.deliveryStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBroadcasts = async (req, res) => {
  try {
    const broadcasts = await EmergencyBroadcast.find()
      .sort({ sentAt: -1 })
      .populate('sentBy', 'username');
    res.json(broadcasts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.acknowledgeBroadcast = async (req, res) => {
  try {
    const { broadcastId } = req.params;
    const studentId = req.student.id;
    
    await EmergencyBroadcast.findByIdAndUpdate(broadcastId, {
      $push: {
        acknowledgedBy: { studentId, acknowledgedAt: new Date() }
      }
    });
    
    res.json({ message: 'Acknowledged' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

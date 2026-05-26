const AuditLog = require('../models/AuditLog');

exports.getLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 50, 
      action, 
      entity, 
      userId,
      severity,
      startDate,
      endDate
    } = req.query;
    
    const filter = {};
    if (action) filter.action = action;
    if (entity) filter.entity = entity;
    if (severity) filter.severity = severity;
    if (userId) filter['performedBy.userId'] = userId;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }
    
    const logs = await AuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const total = await AuditLog.countDocuments(filter);
    
    res.json({
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const stats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const severityStats = await AuditLog.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const recentActivity = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('action entity description performedBy createdAt');
    
    res.json({
      actionStats: stats,
      severityStats,
      recentActivity
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getEntityHistory = async (req, res) => {
  try {
    const { entity, entityId } = req.params;
    
    const logs = await AuditLog.find({ entity, entityId })
      .sort({ createdAt: -1 });
    
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

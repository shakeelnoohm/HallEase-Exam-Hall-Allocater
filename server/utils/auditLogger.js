const AuditLog = require('../models/AuditLog');

/**
 * Create an audit log entry
 */
async function logAction({
  action,
  entity,
  entityId,
  description,
  performedBy,
  ipAddress = null,
  userAgent = null,
  oldValues = null,
  newValues = null,
  metadata = null,
  severity = 'INFO'
}) {
  try {
    const log = new AuditLog({
      action,
      entity,
      entityId,
      description,
      performedBy,
      ipAddress,
      userAgent,
      oldValues,
      newValues,
      metadata,
      severity
    });
    await log.save();
    return log;
  } catch (err) {
    console.error('Failed to create audit log:', err);
    return null;
  }
}

/**
 * Middleware to capture request details
 */
function auditMiddleware(action, entity, getDescription) {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);
    
    // Override json method to capture response
    res.json = function(data) {
      // Restore original method
      res.json = originalJson;
      
      // Log after response is sent
      const description = getDescription ? getDescription(req, data) : `${action} ${entity}`;
      
      logAction({
        action,
        entity,
        entityId: req.params.id || req.body._id || data._id,
        description,
        performedBy: {
          userId: req.admin?.id || req.student?.id || req.invigilator?.id,
          userType: req.admin ? 'Admin' : req.invigilator ? 'Invigilator' : req.student ? 'Student' : 'System',
          username: req.admin?.username || req.student?.rollNo || req.invigilator?.name
        },
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        oldValues: req.body.oldValues,
        newValues: req.body,
        metadata: { params: req.params, query: req.query },
        severity: data.success === false ? 'WARNING' : 'INFO'
      }).catch(console.error);
      
      return originalJson(data);
    };
    
    next();
  };
}

module.exports = {
  logAction,
  auditMiddleware
};

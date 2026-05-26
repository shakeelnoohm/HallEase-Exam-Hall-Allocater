const RolePermission = require('../models/RolePermission');

exports.initializeRoles = async () => {
  const roles = [
    {
      role: 'SUPER_ADMIN',
      description: 'Full system access across all colleges',
      permissions: {
        createAdmin: true,
        manageAdmins: true,
        viewStudents: true,
        createStudents: true,
        editStudents: true,
        deleteStudents: true,
        bulkImportStudents: true,
        viewExams: true,
        createExams: true,
        editExams: true,
        deleteExams: true,
        viewRooms: true,
        createRooms: true,
        editRooms: true,
        deleteRooms: true,
        blockSeats: true,
        viewAllocations: true,
        createAllocations: true,
        deleteAllocations: true,
        viewInvigilators: true,
        createInvigilators: true,
        assignInvigilators: true,
        sendEmails: true,
        sendSMS: true,
        emergencyBroadcast: true,
        viewAnalytics: true,
        exportData: true,
        viewAuditLogs: true,
        manageBackups: true,
        manageSettings: true,
        viewSupportTickets: true,
        respondToTickets: true,
        viewOwnDataOnly: false,
        departmentRestricted: false
      }
    },
    {
      role: 'COLLEGE_ADMIN',
      description: 'Manage exams within their college',
      permissions: {
        createAdmin: false,
        manageAdmins: false,
        viewStudents: true,
        createStudents: true,
        editStudents: true,
        deleteStudents: false,
        bulkImportStudents: true,
        viewExams: true,
        createExams: true,
        editExams: true,
        deleteExams: true,
        viewRooms: true,
        createRooms: true,
        editRooms: true,
        deleteRooms: false,
        blockSeats: true,
        viewAllocations: true,
        createAllocations: true,
        deleteAllocations: true,
        viewInvigilators: true,
        createInvigilators: true,
        assignInvigilators: true,
        sendEmails: true,
        sendSMS: true,
        emergencyBroadcast: true,
        viewAnalytics: true,
        exportData: true,
        viewAuditLogs: true,
        manageBackups: false,
        manageSettings: false,
        viewSupportTickets: true,
        respondToTickets: true,
        viewOwnDataOnly: false,
        departmentRestricted: false
      }
    },
    {
      role: 'DEPARTMENT_HEAD',
      description: 'Manage exams for their department only',
      permissions: {
        createAdmin: false,
        manageAdmins: false,
        viewStudents: true,
        createStudents: true,
        editStudents: true,
        deleteStudents: false,
        bulkImportStudents: false,
        viewExams: true,
        createExams: true,
        editExams: true,
        deleteExams: false,
        viewRooms: true,
        createRooms: false,
        editRooms: false,
        deleteRooms: false,
        blockSeats: false,
        viewAllocations: true,
        createAllocations: true,
        deleteAllocations: false,
        viewInvigilators: true,
        createInvigilators: false,
        assignInvigilators: false,
        sendEmails: true,
        sendSMS: false,
        emergencyBroadcast: false,
        viewAnalytics: true,
        exportData: false,
        viewAuditLogs: false,
        manageBackups: false,
        manageSettings: false,
        viewSupportTickets: true,
        respondToTickets: false,
        viewOwnDataOnly: false,
        departmentRestricted: true
      }
    },
    {
      role: 'INVIGILATOR',
      description: 'View assigned halls and mark attendance',
      permissions: {
        createAdmin: false,
        manageAdmins: false,
        viewStudents: true,
        createStudents: false,
        editStudents: false,
        deleteStudents: false,
        bulkImportStudents: false,
        viewExams: true,
        createExams: false,
        editExams: false,
        deleteExams: false,
        viewRooms: true,
        createRooms: false,
        editRooms: false,
        deleteRooms: false,
        blockSeats: false,
        viewAllocations: true,
        createAllocations: false,
        deleteAllocations: false,
        viewInvigilators: false,
        createInvigilators: false,
        assignInvigilators: false,
        sendEmails: false,
        sendSMS: false,
        emergencyBroadcast: false,
        viewAnalytics: false,
        exportData: false,
        viewAuditLogs: false,
        manageBackups: false,
        manageSettings: false,
        viewSupportTickets: false,
        respondToTickets: false,
        viewOwnDataOnly: true,
        departmentRestricted: false
      }
    },
    {
      role: 'STUDENT',
      description: 'View own exam allocations only',
      permissions: {
        viewOwnDataOnly: true,
        viewExams: true,
        viewRooms: true,
        viewAllocations: true
      }
    },
    {
      role: 'PARENT',
      description: 'View child exam information',
      permissions: {
        viewOwnDataOnly: true,
        viewExams: true,
        viewAllocations: true
      }
    }
  ];
  
  for (const roleData of roles) {
    await RolePermission.findOneAndUpdate(
      { role: roleData.role },
      roleData,
      { upsert: true, new: true }
    );
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await RolePermission.find({ isActive: true });
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRole = async (req, res) => {
  try {
    const { role } = req.params;
    const roleData = await RolePermission.findOne({ role });
    if (!roleData) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(roleData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    const { role } = req.params;
    const { permissions } = req.body;
    
    const roleData = await RolePermission.findOneAndUpdate(
      { role },
      { permissions },
      { new: true }
    );
    
    res.json(roleData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const userRole = req.admin?.role || req.invigilator?.role || 'STUDENT';
      const roleData = await RolePermission.findOne({ role: userRole });
      
      if (!roleData || !roleData.permissions[permission]) {
        return res.status(403).json({ message: 'Permission denied' });
      }
      
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

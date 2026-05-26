const mongoose = require('mongoose');

const rolePermissionSchema = new mongoose.Schema({
  role: { type: String, enum: ['SUPER_ADMIN', 'COLLEGE_ADMIN', 'DEPARTMENT_HEAD', 'INVIGILATOR', 'STUDENT', 'PARENT'], required: true, unique: true },
  description: { type: String },
  permissions: {
    // Admin Management
    createAdmin: { type: Boolean, default: false },
    manageAdmins: { type: Boolean, default: false },
    
    // Student Management
    viewStudents: { type: Boolean, default: false },
    createStudents: { type: Boolean, default: false },
    editStudents: { type: Boolean, default: false },
    deleteStudents: { type: Boolean, default: false },
    bulkImportStudents: { type: Boolean, default: false },
    
    // Exam Management
    viewExams: { type: Boolean, default: true },
    createExams: { type: Boolean, default: false },
    editExams: { type: Boolean, default: false },
    deleteExams: { type: Boolean, default: false },
    
    // Room Management
    viewRooms: { type: Boolean, default: true },
    createRooms: { type: Boolean, default: false },
    editRooms: { type: Boolean, default: false },
    deleteRooms: { type: Boolean, default: false },
    blockSeats: { type: Boolean, default: false },
    
    // Allocation
    viewAllocations: { type: Boolean, default: true },
    createAllocations: { type: Boolean, default: false },
    deleteAllocations: { type: Boolean, default: false },
    
    // Invigilator
    viewInvigilators: { type: Boolean, default: false },
    createInvigilators: { type: Boolean, default: false },
    assignInvigilators: { type: Boolean, default: false },
    
    // Communications
    sendEmails: { type: Boolean, default: false },
    sendSMS: { type: Boolean, default: false },
    emergencyBroadcast: { type: Boolean, default: false },
    
    // Reports & Analytics
    viewAnalytics: { type: Boolean, default: false },
    exportData: { type: Boolean, default: false },
    viewAuditLogs: { type: Boolean, default: false },
    
    // System
    manageBackups: { type: Boolean, default: false },
    manageSettings: { type: Boolean, default: false },
    
    // Chat Support
    viewSupportTickets: { type: Boolean, default: false },
    respondToTickets: { type: Boolean, default: false },
    
    // Special
    viewOwnDataOnly: { type: Boolean, default: false },
    departmentRestricted: { type: Boolean, default: false }
  },
  allowedDepartments: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('RolePermission', rolePermissionSchema);

const Backup = require('../models/Backup');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

exports.createBackup = async (req, res) => {
  try {
    const { type = 'MANUAL' } = req.body;
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup_${type}_${timestamp}.gz`;
    const filepath = path.join(__dirname, '../backups', filename);
    
    // Ensure backups directory exists
    if (!fs.existsSync(path.dirname(filepath))) {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
    }
    
    const backup = new Backup({
      type,
      filePath: filepath,
      status: 'IN_PROGRESS',
      triggeredBy: req.admin?.id
    });
    await backup.save();
    
    // Get MongoDB URI from env
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hallease';
    
    // Create mongodump command
    const cmd = `mongodump --uri="${mongoUri}" --archive="${filepath}" --gzip`;
    
    exec(cmd, async (error, stdout, stderr) => {
      if (error) {
        backup.status = 'FAILED';
        backup.errorMessage = error.message;
        await backup.save();
        console.error('Backup failed:', error);
        return;
      }
      
      // Get file size
      const stats = fs.statSync(filepath);
      
      // Get record counts
      const Student = require('../models/Student');
      const Exam = require('../models/Exam');
      const Room = require('../models/Room');
      const Allotment = require('../models/Allotment');
      
      const [students, exams, rooms, allotments] = await Promise.all([
        Student.countDocuments(),
        Exam.countDocuments(),
        Room.countDocuments(),
        Allotment.countDocuments()
      ]);
      
      backup.status = 'COMPLETED';
      backup.fileSize = stats.size;
      backup.recordCounts = { students, exams, rooms, allotments };
      backup.completedAt = new Date();
      backup.retentionUntil = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // 90 days
      await backup.save();
    });
    
    res.json({ message: 'Backup started', backup });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBackups = async (req, res) => {
  try {
    const backups = await Backup.find()
      .sort({ createdAt: -1 })
      .populate('triggeredBy', 'username');
    res.json(backups);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    const { id } = req.params;
    const backup = await Backup.findById(id);
    
    if (!backup || backup.status !== 'COMPLETED') {
      return res.status(404).json({ message: 'Backup not found or incomplete' });
    }
    
    if (!fs.existsSync(backup.filePath)) {
      return res.status(404).json({ message: 'Backup file not found' });
    }
    
    res.download(backup.filePath, path.basename(backup.filePath));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    const { id } = req.params;
    const backup = await Backup.findById(id);
    
    if (!backup || backup.status !== 'COMPLETED') {
      return res.status(404).json({ message: 'Backup not found or incomplete' });
    }
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hallease';
    const cmd = `mongorestore --uri="${mongoUri}" --archive="${backup.filePath}" --gzip --drop`;
    
    const { stdout, stderr } = await execPromise(cmd);
    
    backup.isRestored = true;
    backup.restoredAt = new Date();
    await backup.save();
    
    res.json({ message: 'Restore completed', output: stdout });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteBackup = async (req, res) => {
  try {
    const { id } = req.params;
    const backup = await Backup.findById(id);
    
    if (backup && fs.existsSync(backup.filePath)) {
      fs.unlinkSync(backup.filePath);
    }
    
    await Backup.findByIdAndDelete(id);
    res.json({ message: 'Backup deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

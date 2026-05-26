const QuestionPaper = require('../models/QuestionPaper');
const QRCode = require('qrcode');

exports.createBundle = async (req, res) => {
  try {
    const { examId, roomId, packetCount } = req.body;
    
    // Generate unique bundle code
    const timestamp = Date.now().toString(36).toUpperCase();
    const bundleCode = `QP-${examId.toString().slice(-4)}-${roomId.toString().slice(-4)}-${timestamp}`;
    const sealNumber = `SEAL-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    
    const bundle = new QuestionPaper({
      examId,
      roomId,
      bundleCode,
      sealNumber,
      packetCount,
      custodyChain: [{
        status: 'IN_VAULT',
        handledAt: new Date(),
        notes: 'Bundle created and sealed in vault'
      }]
    });
    
    await bundle.save();
    
    // Generate tracking QR code
    const qrDataUrl = await QRCode.toDataURL(bundleCode);
    
    res.json({ bundle, qrCode: qrDataUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBundles = async (req, res) => {
  try {
    const { examId, roomId, status } = req.query;
    
    const filter = {};
    if (examId) filter.examId = examId;
    if (roomId) filter.roomId = roomId;
    if (status) filter.status = status;
    
    const bundles = await QuestionPaper.find(filter)
      .populate('examId', 'title subject examDate')
      .populate('roomId', 'roomNo')
      .populate('receivedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(bundles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, location, notes, signature } = req.body;
    const handledBy = req.invigilator?.id || req.admin?.id;
    
    const bundle = await QuestionPaper.findById(id);
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }
    
    // Add to custody chain
    bundle.custodyChain.push({
      status,
      handledBy,
      handledAt: new Date(),
      location,
      notes,
      signature
    });
    
    bundle.status = status;
    
    // Update timestamps
    if (status === 'RECEIVED_AT_HALL') {
      bundle.receivedAt = new Date();
      bundle.receivedBy = handledBy;
    } else if (status === 'DISTRIBUTED') {
      bundle.distributedAt = new Date();
    } else if (status === 'COLLECTED') {
      bundle.collectedAt = new Date();
    } else if (status === 'RETURNED_TO_VAULT') {
      bundle.returnedAt = new Date();
    }
    
    await bundle.save();
    
    res.json(bundle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reportCompromise = async (req, res) => {
  try {
    const { id } = req.params;
    const { report } = req.body;
    
    const bundle = await QuestionPaper.findByIdAndUpdate(id, {
      isCompromised: true,
      compromiseReport: report,
      status: 'COMPROMISED'
    }, { new: true });
    
    res.json(bundle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyBundle = async (req, res) => {
  try {
    const { bundleCode } = req.body;
    
    const bundle = await QuestionPaper.findOne({ bundleCode })
      .populate('examId', 'title subject examDate')
      .populate('roomId', 'roomNo');
    
    if (!bundle) {
      return res.status(404).json({ message: 'Bundle not found' });
    }
    
    res.json({
      valid: true,
      bundle: {
        bundleCode: bundle.bundleCode,
        sealNumber: bundle.sealNumber,
        exam: bundle.examId,
        room: bundle.roomId,
        status: bundle.status,
        packetCount: bundle.packetCount,
        custodyChain: bundle.custodyChain.slice(-3) // Last 3 custody events
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

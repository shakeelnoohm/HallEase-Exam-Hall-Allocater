const Chat = require('../models/Chat');
const Student = require('../models/Student');
const Admin = require('../models/Admin');

exports.createChat = async (req, res) => {
  try {
    const { type, relatedTo, initialMessage } = req.body;
    const userId = req.student?.id || req.admin?.id;
    const userType = req.student ? 'Student' : 'Admin';
    const user = req.student || req.admin;
    
    const chat = new Chat({
      type,
      relatedTo,
      participants: [{
        userId,
        userType,
        name: user.name || user.username
      }],
      messages: initialMessage ? [{
        sender: { userId, userType, name: user.name || user.username },
        content: initialMessage,
        sentAt: new Date()
      }] : []
    });
    
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyChats = async (req, res) => {
  try {
    const userId = req.student?.id || req.admin?.id;
    
    const chats = await Chat.find({
      'participants.userId': userId
    })
    .sort({ lastActivityAt: -1 })
    .populate('relatedTo.entityId');
    
    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSupportTickets = async (req, res) => {
  try {
    const { status, priority, assignedToMe } = req.query;
    
    const filter = { type: 'SUPPORT' };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedToMe === 'true') filter.assignedTo = req.admin.id;
    
    const tickets = await Chat.find(filter)
      .sort({ priority: -1, lastActivityAt: -1 })
      .populate('participants.userId', 'name rollNo')
      .populate('assignedTo', 'username');
    
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, attachments } = req.body;
    const userId = req.student?.id || req.admin?.id;
    const userType = req.student ? 'Student' : 'Admin';
    const user = req.student || req.admin;
    
    const chat = await Chat.findByIdAndUpdate(chatId, {
      $push: {
        messages: {
          sender: { userId, userType, name: user.name || user.username },
          content,
          attachments,
          sentAt: new Date()
        }
      },
      $set: { lastActivityAt: new Date() }
    }, { new: true });
    
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { adminId } = req.body;
    
    const chat = await Chat.findByIdAndUpdate(chatId, {
      assignedTo: adminId,
      status: adminId ? 'OPEN' : 'PENDING'
    }, { new: true });
    
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resolveTicket = async (req, res) => {
  try {
    const { chatId } = req.params;
    
    const chat = await Chat.findByIdAndUpdate(chatId, {
      status: 'RESOLVED',
      resolvedAt: new Date()
    }, { new: true });
    
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

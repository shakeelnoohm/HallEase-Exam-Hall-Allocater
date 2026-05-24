const Room = require('../models/Room');

exports.addRoom = async (req, res) => {
  try {
    const { roomNo, capacity, rows, cols } = req.body;
    if (!roomNo || !capacity) {
      return res.status(400).json({ message: 'Room number and capacity are required' });
    }
    const existingRoom = await Room.findOne({ roomNo: { $regex: new RegExp(`^${roomNo.trim()}$`, 'i') } });
    if (existingRoom) {
      return res.status(400).json({ message: 'A room with this name already exists' });
    }
    const r = rows || Math.ceil(capacity / (cols || 6));
    const c = cols || 6;
    const newRoom = new Room({ roomNo: roomNo.trim(), capacity: Number(capacity), rows: r, cols: c });
    await newRoom.save();
    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error adding room', error: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNo: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

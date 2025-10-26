const Room = require('../models/Room');

// Add new room
exports.addRoom = async (req, res) => {
  try {
    const { roomNo } = req.body;

    // Check if roomNo is provided
    if (!roomNo) {
      return res.status(400).json({ message: 'Room name is required' });
    }

    //  Check if a room with the same roomNo (case-insensitive) already exists
    const existingRoom = await Room.findOne({
      roomNo: { $regex: new RegExp(`^${roomNo.trim()}$`, 'i') }, // 'i' = case-insensitive
    });

    if (existingRoom) {
      return res.status(400).json({
        message: 'A room with this name already exists',
      });
    }

    // ✅ 3. Add new room
    const newRoom = new Room({ roomNo: roomNo.trim() });
    await newRoom.save();

    res.status(201).json({
      message: 'Room added successfully',
      room: newRoom,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error adding room',
      error: error.message,
    });
  }
};

// Get all rooms
exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching rooms',
      error: error.message,
    });
  }
};

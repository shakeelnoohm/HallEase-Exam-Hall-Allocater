const Room = require('../models/Room');

exports.addRoom = async (req, res) => {
  try {
    const { roomNo, capacity, rows, cols, floor, hasAccessibility } = req.body;
    if (!roomNo || !capacity) {
      return res.status(400).json({ message: 'Room number and capacity are required' });
    }
    const existingRoom = await Room.findOne({ roomNo: { $regex: new RegExp(`^${roomNo.trim()}$`, 'i') } });
    if (existingRoom) {
      return res.status(400).json({ message: 'A room with this name already exists' });
    }
    const r = rows || Math.ceil(capacity / (cols || 6));
    const c = cols || 6;
    const newRoom = new Room({
      roomNo: roomNo.trim(),
      capacity: Number(capacity),
      rows: r,
      cols: c,
      floor: floor || 1,
      hasAccessibility: hasAccessibility || false
    });
    await newRoom.save();
    res.status(201).json({ message: 'Room added successfully', room: newRoom });
  } catch (error) {
    res.status(500).json({ message: 'Error adding room', error: error.message });
  }
};

exports.getRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate('invigilatorId', 'name email')
      .sort({ roomNo: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('invigilatorId', 'name email phone');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

exports.blockSeats = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { seats, reason } = req.body; // seats = [{row, col}, ...]
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    // Add blocked seats with reason
    const newBlocked = seats.map(s => ({
      row: s.row,
      col: s.col,
      reason: reason || 'Blocked by admin'
    }));
    
    // Merge with existing blocked seats (avoid duplicates)
    const existingBlocked = room.blockedSeats || [];
    const merged = [...existingBlocked];
    
    for (const newSeat of newBlocked) {
      const exists = merged.some(s => s.row === newSeat.row && s.col === newSeat.col);
      if (!exists) merged.push(newSeat);
    }
    
    room.blockedSeats = merged;
    await room.save();
    
    res.json({ message: 'Seats blocked successfully', blockedSeats: room.blockedSeats });
  } catch (error) {
    res.status(500).json({ message: 'Error blocking seats', error: error.message });
  }
};

exports.unblockSeats = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { seats } = req.body; // seats = [{row, col}, ...]
    
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    room.blockedSeats = (room.blockedSeats || []).filter(
      s => !seats.some(us => us.row === s.row && us.col === s.col)
    );
    
    await room.save();
    res.json({ message: 'Seats unblocked', blockedSeats: room.blockedSeats });
  } catch (error) {
    res.status(500).json({ message: 'Error unblocking seats', error: error.message });
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

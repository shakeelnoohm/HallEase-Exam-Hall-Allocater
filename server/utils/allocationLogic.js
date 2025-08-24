const Allotment = require('../models/Allotment');

const generateAllotments = async (students, rooms, examDate) => {
  let roomIndex = 0;
  let seatCount = 0;

  for (let student of students) {
    if (roomIndex >= rooms.length) break; // Not enough rooms

    const room = rooms[roomIndex];
    const seatNo = seatCount + 1;

    // Create allotment record
    await Allotment.create({
      studentId: student._id,
      roomNo: room.roomNo,
      seatNo: `S${seatNo}`,
      examDate: examDate
    });

    seatCount++;

    if (seatCount >= room.capacity) {
      seatCount = 0;
      roomIndex++;
    }
  }
};

module.exports = generateAllotments;

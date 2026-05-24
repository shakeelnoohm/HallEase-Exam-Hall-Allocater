const Allotment = require('../models/Allotment');

/**
 * Interleave students from multiple groups (departments) so that
 * no two students from the same department are placed side-by-side
 * in the same row. Uses round-robin across groups.
 *
 * @param {Array} studentGroups - Array of arrays, each inner array = students of one dept
 * @returns {Array} - Interleaved flat array of students
 */
function interleaveGroups(studentGroups) {
  const result = [];
  const queues = studentGroups.map(g => [...g]);
  let emptyRounds = 0;

  while (emptyRounds < queues.length) {
    emptyRounds = 0;
    for (let q = 0; q < queues.length; q++) {
      if (queues[q].length === 0) {
        emptyRounds++;
        continue;
      }
      result.push(queues[q].shift());
    }
  }
  return result;
}

/**
 * Generate allotments for an exam.
 * Students are interleaved by department so no two same-dept students sit adjacent.
 *
 * @param {Array} students - All students for this exam
 * @param {Array} rooms    - Available rooms sorted by capacity
 * @param {ObjectId} examId
 */
const generateAllotments = async (students, rooms, examId) => {
  // Group students by department
  const deptMap = {};
  for (const s of students) {
    const key = `${s.department}-${s.semester}`;
    if (!deptMap[key]) deptMap[key] = [];
    deptMap[key].push(s);
  }
  const groups = Object.values(deptMap);

  // Interleave across groups
  const orderedStudents = interleaveGroups(groups);

  const allotments = [];
  let roomIdx = 0;
  let seatInRoom = 0;

  for (const student of orderedStudents) {
    while (roomIdx < rooms.length && seatInRoom >= rooms[roomIdx].capacity) {
      roomIdx++;
      seatInRoom = 0;
    }
    if (roomIdx >= rooms.length) break;

    const room = rooms[roomIdx];
    const cols = room.cols || 6;
    const row = Math.floor(seatInRoom / cols) + 1;
    const col = (seatInRoom % cols) + 1;
    const colLetter = String.fromCharCode(64 + col);
    const seatNo = `R${row}${colLetter}`;

    allotments.push({
      examId,
      studentId: student._id,
      roomId: room._id,
      seatNo,
      row,
      col
    });

    seatInRoom++;
  }

  await Allotment.insertMany(allotments);
  return allotments;
};

module.exports = generateAllotments;

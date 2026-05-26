/**
 * Smart Seating Algorithm with multiple optimization strategies
 */

class SmartSeatingEngine {
  constructor() {
    this.preferences = {
      wheelchair: { preferGroundFloor: true, preferAisle: true },
      extraTime: { preferFrontRow: true, isolatedSeating: true },
      scribe: { preferBackRow: true, extraSpace: true },
      visualAid: { preferFrontRow: true, goodLighting: true },
      hearingAid: { preferFrontRow: true, visualAlerts: true },
      frontRow: { preferRow1: true }
    };
  }

  /**
   * Calculate compatibility score between two students
   */
  calculateCompatibility(student1, student2) {
    let score = 0;
    
    // Penalize same department heavily
    if (student1.department === student2.department) {
      score -= 100;
    }
    
    // Penalize same semester within same department
    if (student1.department === student2.department && 
        student1.semester === student2.semester) {
      score -= 50;
    }
    
    // Bonus for diversity
    if (student1.department !== student2.department) {
      score += 10;
    }
    
    return score;
  }

  /**
   * Get seating priority for student based on accommodations
   */
  getSeatingPriority(student) {
    const acc = student.accommodations || {};
    let priority = 0;
    let constraints = [];
    
    if (acc.wheelchair) {
      priority += 100;
      constraints.push({ type: 'groundFloor', weight: 100 });
      constraints.push({ type: 'aisleSeat', weight: 50 });
    }
    
    if (acc.visualAid || acc.hearingAid || acc.frontRow) {
      priority += 80;
      constraints.push({ type: 'frontRow', weight: 80 });
    }
    
    if (acc.extraTime) {
      priority += 70;
      constraints.push({ type: 'isolatedSeating', weight: 60 });
    }
    
    if (acc.scribe) {
      priority += 60;
      constraints.push({ type: 'extraSpace', weight: 50 });
    }
    
    return { priority, constraints, student };
  }

  /**
   * Assign students to rooms with smart placement
   */
  async assignStudents(students, rooms, options = {}) {
    const prioritizedStudents = students
      .map(s => this.getSeatingPriority(s))
      .sort((a, b) => b.priority - a.priority);
    
    const allocations = [];
    const roomStates = rooms.map(room => ({
      room,
      availableSeats: this.generateSeatMap(room),
      usedSeats: [],
      blockedSeats: room.blockedSeats || []
    }));
    
    // First pass: assign students with special needs
    for (const { student, constraints } of prioritizedStudents.filter(p => p.priority > 0)) {
      let assigned = false;
      
      for (const roomState of roomStates) {
        // Skip upper floors for wheelchair users
        if (constraints.some(c => c.type === 'groundFloor') && roomState.room.floor > 0) {
          continue;
        }
        
        const seat = this.findOptimalSeat(student, roomState, constraints, allocations);
        if (seat) {
          allocations.push({
            studentId: student._id,
            roomId: roomState.room._id,
            seatNo: seat.label,
            row: seat.row,
            col: seat.col,
            isSpecial: true
          });
          roomState.usedSeats.push(seat);
          assigned = true;
          break;
        }
      }
      
      if (!assigned) {
        // Fall back to any available room
        for (const roomState of roomStates) {
          const seat = this.findAnySeat(roomState);
          if (seat) {
            allocations.push({
              studentId: student._id,
              roomId: roomState.room._id,
              seatNo: seat.label,
              row: seat.row,
              col: seat.col,
              isSpecial: false
            });
            roomState.usedSeats.push(seat);
            break;
          }
        }
      }
    }
    
    // Second pass: assign remaining students with interleaving
    const remaining = prioritizedStudents.filter(p => p.priority === 0).map(p => p.student);
    const interleaved = this.interleaveByDepartment(remaining);
    
    for (const student of interleaved) {
      for (const roomState of roomStates) {
        const seat = this.findOptimalSeat(student, roomState, [], allocations);
        if (seat) {
          allocations.push({
            studentId: student._id,
            roomId: roomState.room._id,
            seatNo: seat.label,
            row: seat.row,
            col: seat.col
          });
          roomState.usedSeats.push(seat);
          break;
        }
      }
    }
    
    return allocations;
  }

  /**
   * Generate seat map for a room
   */
  generateSeatMap(room) {
    const seats = [];
    for (let r = 1; r <= room.rows; r++) {
      for (let c = 1; c <= room.cols; c++) {
        const colLabel = String.fromCharCode(64 + c);
        seats.push({
          row: r,
          col: c,
          label: `R${r}${colLabel}`,
          isAisle: c === 1 || c === room.cols
        });
      }
    }
    return seats;
  }

  /**
   * Find optimal seat considering constraints and neighbors
   */
  findOptimalSeat(student, roomState, constraints, existingAllocations) {
    const available = roomState.availableSeats.filter(seat => 
      !roomState.usedSeats.some(used => used.label === seat.label) &&
      !roomState.blockedSeats.some(blocked => 
        blocked.row === seat.row && blocked.col === seat.col
      )
    );
    
    let bestSeat = null;
    let bestScore = -Infinity;
    
    for (const seat of available) {
      let score = 0;
      
      // Check constraints
      for (const constraint of constraints) {
        if (constraint.type === 'frontRow' && seat.row === 1) {
          score += constraint.weight;
        }
        if (constraint.type === 'aisleSeat' && seat.isAisle) {
          score += constraint.weight;
        }
        if (constraint.type === 'isolatedSeating') {
          // Check if neighbors exist
          const hasNeighbor = existingAllocations.some(a => 
            a.roomId.toString() === roomState.room._id.toString() &&
            Math.abs(a.row - seat.row) <= 1 &&
            Math.abs(a.col - seat.col) <= 1
          );
          if (!hasNeighbor) score += constraint.weight;
        }
      }
      
      // Check compatibility with existing neighbors
      const neighbors = existingAllocations.filter(a => 
        a.roomId.toString() === roomState.room._id.toString() &&
        a.row === seat.row &&
        Math.abs(a.col - seat.col) === 1
      );
      
      for (const neighbor of neighbors) {
        if (neighbor.department === student.department) {
          score -= 100; // Heavy penalty for same department
        }
      }
      
      // Prefer front rows for better proctor visibility
      score += (roomState.room.rows - seat.row) * 5;
      
      if (score > bestScore) {
        bestScore = score;
        bestSeat = seat;
      }
    }
    
    return bestSeat;
  }

  /**
   * Interleave students by department
   */
  interleaveByDepartment(students) {
    const byDept = {};
    students.forEach(s => {
      if (!byDept[s.department]) byDept[s.department] = [];
      byDept[s.department].push(s);
    });
    
    const queues = Object.values(byDept);
    const result = [];
    
    while (queues.some(q => q.length > 0)) {
      for (const queue of queues) {
        if (queue.length > 0) {
          result.push(queue.shift());
        }
      }
    }
    
    return result;
  }

  findAnySeat(roomState) {
    return roomState.availableSeats.find(seat => 
      !roomState.usedSeats.some(used => used.label === seat.label) &&
      !roomState.blockedSeats.some(blocked => 
        blocked.row === seat.row && blocked.col === seat.col
      )
    );
  }
}

module.exports = SmartSeatingEngine;

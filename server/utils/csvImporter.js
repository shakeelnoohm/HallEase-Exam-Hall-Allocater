const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs');

/**
 * Parse CSV file and return array of student objects
 * Expected CSV columns: name, rollNo, email, department, semester, year, password
 * Optional columns: wheelchair, extraTime, scribe, frontRow
 */
function parseStudentCSV(filePath) {
  return new Promise((resolve, reject) => {
    const students = [];
    const errors = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Validate required fields
          if (!row.name || !row.rollNo || !row.email || !row.department || !row.semester) {
            errors.push(`Missing required fields for row: ${JSON.stringify(row)}`);
            return;
          }
          
          const student = {
            name: row.name.trim(),
            rollNo: row.rollNo.trim().toUpperCase(),
            email: row.email.trim().toLowerCase(),
            password: row.password || row.rollNo, // Default password = rollNo
            department: row.department.trim(),
            semester: parseInt(row.semester),
            year: parseInt(row.year) || Math.ceil(parseInt(row.semester) / 2),
            accommodations: {
              wheelchair: row.wheelchair === 'true' || row.wheelchair === '1',
              extraTime: row.extraTime === 'true' || row.extraTime === '1',
              scribe: row.scribe === 'true' || row.scribe === '1',
              frontRow: row.frontRow === 'true' || row.frontRow === '1',
              visualAid: row.visualAid === 'true' || row.visualAid === '1',
              hearingAid: row.hearingAid === 'true' || row.hearingAid === '1'
            }
          };
          
          students.push(student);
        } catch (err) {
          errors.push(`Error parsing row: ${err.message}`);
        }
      })
      .on('end', () => {
        resolve({ students, errors, total: students.length + errors.length });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

/**
 * Generate CSV template content for students
 */
function generateStudentTemplate() {
  const headers = ['name', 'rollNo', 'email', 'password', 'department', 'semester', 'year', 'wheelchair', 'extraTime', 'scribe', 'frontRow'];
  const example1 = ['John Doe', 'CS2301', 'john@college.edu', 'pass123', 'Computer Science', '3', '2', 'false', 'false', 'false', 'false'];
  const example2 = ['Jane Smith', 'EC2302', 'jane@college.edu', 'pass123', 'Electronics', '3', '2', 'false', 'true', 'false', 'false'];
  
  return [headers.join(','), example1.join(','), example2.join(',')].join('\n');
}

module.exports = {
  parseStudentCSV,
  generateStudentTemplate
};

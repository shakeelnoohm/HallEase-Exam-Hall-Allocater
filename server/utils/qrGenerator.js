const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');

/**
 * Generate QR code data URL for student exam check-in
 * Contains signed JWT with studentId, examId, and seat info
 */
async function generateStudentQR(studentId, examId, seatInfo) {
  const payload = {
    studentId: studentId.toString(),
    examId: examId.toString(),
    seatNo: seatInfo.seatNo,
    roomNo: seatInfo.roomNo,
    iat: Date.now()
  };
  
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
  const dataUrl = await QRCode.toDataURL(token, {
    width: 256,
    margin: 2,
    color: {
      dark: '#1e3a8a',
      light: '#ffffff'
    }
  });
  
  return { token, dataUrl };
}

/**
 * Verify QR token and return decoded data
 */
function verifyQRToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateStudentQR,
  verifyQRToken
};

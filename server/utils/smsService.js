/**
 * SMS Service - Currently disabled
 * To enable SMS, configure a provider (Twilio, AWS SNS, etc.)
 */

async function sendSMS(to, message) {
  console.log('[SMS DISABLED] Would send:', { to, message });
  return { success: false, error: 'SMS service not configured' };
}

/**
 * Send bulk SMS
 */
async function sendBulkSMS(recipients, message) {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendSMS(recipient.phone, message);
    results.push({
      phone: recipient.phone,
      success: result.success,
      sid: result.sid,
      error: result.error
    });
    
    // Rate limiting - small delay between sends
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return {
    total: recipients.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  };
}

/**
 * Send exam allocation SMS to student
 */
async function sendAllocationSMS(student, exam, allotment) {
  const message = `HallEase: Your seat is allocated!
Exam: ${exam.title}
Date: ${new Date(exam.examDate).toLocaleDateString()}
Time: ${exam.startTime}
Hall: ${allotment.roomId?.roomNo || 'TBA'}
Seat: ${allotment.seatNo}
Good luck! 🎓`;
  
  return sendSMS(student.phone, message);
}

/**
 * Send emergency broadcast SMS
 */
async function sendEmergencySMS(student, broadcast) {
  const message = `URGENT - HallEase:\n${broadcast.title}\n${broadcast.message}\nPlease check your email for details.`;
  
  return sendSMS(student.phone, message);
}

module.exports = {
  sendSMS,
  sendBulkSMS,
  sendAllocationSMS,
  sendEmergencySMS
};

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendAllotmentEmail = async ({ to, studentName, examTitle, examType, subject, examDate, startTime, endTime, roomNo, seatNo, department, semester }) => {
  const dateStr = new Date(examDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const typeLabel = examType === 'university' ? 'University Examination' : 'Internal Examination';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
      <div style="background: #1d4ed8; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">HallEase</h1>
        <p style="margin: 4px 0 0; opacity: 0.85;">Exam Hall Allocation System</p>
      </div>
      <div style="padding: 28px;">
        <p style="font-size: 16px;">Dear <strong>${studentName}</strong>,</p>
        <p>Your exam hall has been allocated. Please find the details below:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f3f4f6;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e5e7eb;">Exam</td><td style="padding: 10px; border: 1px solid #e5e7eb;">${examTitle}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #e5e7eb;">Type</td><td style="padding: 10px; border: 1px solid #e5e7eb;">${typeLabel}</td></tr>
          <tr style="background: #f3f4f6;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e5e7eb;">Subject</td><td style="padding: 10px; border: 1px solid #e5e7eb;">${subject}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #e5e7eb;">Department</td><td style="padding: 10px; border: 1px solid #e5e7eb;">${department} - Semester ${semester}</td></tr>
          <tr style="background: #f3f4f6;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e5e7eb;">Date</td><td style="padding: 10px; border: 1px solid #e5e7eb;">${dateStr}</td></tr>
          <tr><td style="padding: 10px; font-weight: bold; border: 1px solid #e5e7eb;">Time</td><td style="padding: 10px; border: 1px solid #e5e7eb;">${startTime} - ${endTime}</td></tr>
          <tr style="background: #dbeafe;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e5e7eb;">Exam Hall</td><td style="padding: 10px; border: 1px solid #e5e7eb; font-size: 18px; color: #1d4ed8;"><strong>${roomNo}</strong></td></tr>
          <tr style="background: #dbeafe;"><td style="padding: 10px; font-weight: bold; border: 1px solid #e5e7eb;">Seat Number</td><td style="padding: 10px; border: 1px solid #e5e7eb; font-size: 18px; color: #1d4ed8;"><strong>${seatNo}</strong></td></tr>
        </table>
        <p style="color: #6b7280; font-size: 13px;">Please report to the exam hall 15 minutes before the exam starts. Bring your hall ticket and college ID card.</p>
      </div>
      <div style="background: #f9fafb; padding: 16px; text-align: center; color: #9ca3af; font-size: 12px;">
        This is an automated notification from HallEase. Do not reply to this email.
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: `"HallEase - Exam Hall Allocator" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Exam Hall Allotment: ${subject} on ${dateStr}`,
    html
  });
};

module.exports = { sendAllotmentEmail };

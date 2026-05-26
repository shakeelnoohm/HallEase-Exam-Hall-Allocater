# HallEase – Exam Hall Allocation System

HallEase is a **MERN stack** based Exam Hall Allocation System designed to simplify and automate the process of assigning students to exam halls. It features intelligent seating algorithms, comprehensive admin tools, and a modern responsive interface.

---

## 🚀 Key Features

### 📋 Exam Management
- **Internal & University Exams** – Support for multiple exam types with different allocation rules
- **Visual Calendar** – Monthly/weekly exam schedule with color-coded exam types
- **Conflict Detection** – Automatic detection of overlapping exams for the same students

### 🪑 Smart Seating Allocation
- **Department Interleaving** – Ensures no two students from the same class sit adjacent
- **Special Accommodations** – Priority seating for wheelchair access, extra time, scribe needs
- **Seat Blocking** – Mark broken benches or reserved seats in the visual hall layout
- **Floor Accessibility** – Ground floor preference for mobility-impaired students

### 🔔 Notifications & Communication
- **Email Notifications** – Automatic hall allotment emails with seat details
- **Emergency Broadcasts** – Instant alerts for exam postponements, venue changes
- **In-App Chat Support** – Students can raise tickets, admins can respond in real-time

### 📊 Analytics & Reporting
- **Dashboard Analytics** – Room utilization, peak exam days, department distribution
- **Audit Logs** – Complete history of all admin actions with severity tracking
- **CSV Export** – Export students, exams, and allotments to spreadsheet
- **PDF Generation** – Download seating charts and individual hall tickets

### 🔐 Security & Compliance
- **QR Code Check-in** – Students show QR at entry, invigilators verify with scanner
- **Question Paper Tracking** – Chain-of-custody tracking with QR codes
- **Role-Based Access** – Super Admin, College Admin, Department Head, Invigilator roles
- **Audit Trail** – Immutable logs of all system changes

### 💾 Data Management
- **Auto Backup** – Scheduled MongoDB backups with restore capability
- **CSV Bulk Import** – Import hundreds of students via spreadsheet
- **PWA Support** – Add to home screen, offline functionality, push notifications
- **Dark Mode** – Full dark theme support across all admin pages

---

## � Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router 6, Tailwind CSS 3 |
| **State** | React Hooks, Context API (Theme) |
| **Backend** | Node.js, Express.js 5 |
| **Database** | MongoDB 6, Mongoose 8 |
| **Auth** | JWT, bcrypt |
| **Email** | Nodemailer (Gmail SMTP) |
| **PDF** | jsPDF, jspdf-autotable |
| **QR Codes** | qrcode, @zxing/library |
| **CSV** | csv-parser, @json2csv |

---

## 📁 Project Structure

```
HallEase/
├── client/                    # React Frontend
│   ├── public/
│   │   ├── manifest.json      # PWA manifest
│   │   └── ...
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/         # Admin pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── AnalyticsDashboard.jsx
│   │   │   │   ├── ExamCalendar.jsx
│   │   │   │   ├── ManageExams.jsx
│   │   │   │   ├── ManageRooms.jsx
│   │   │   │   ├── ManageStudents.jsx
│   │   │   │   ├── ManageInvigilators.jsx
│   │   │   │   ├── AllocateHall.jsx
│   │   │   │   ├── ViewAllotmentsAdmin.jsx
│   │   │   │   ├── QRScanner.jsx
│   │   │   │   ├── AuditLogs.jsx
│   │   │   │   ├── EmergencyBroadcast.jsx
│   │   │   │   ├── FeedbackManager.jsx
│   │   │   │   ├── ChatSupport.jsx
│   │   │   │   └── BackupManager.jsx
│   │   │   ├── Student/       # Student pages
│   │   │   │   └── StudentDashboard.jsx
│   │   │   └── Common/
│   │   │       └── AdminLayout.jsx
│   │   ├── context/
│   │   │   └── ThemeContext.js
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── AdminLogin.js
│   │   │   └── StudentLogin.js
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── serviceWorker.js   # PWA service worker
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── allotmentController.js
│   │   ├── analyticsController.js
│   │   ├── auditController.js
│   │   ├── backupController.js
│   │   ├── chatController.js
│   │   ├── emergencyController.js
│   │   ├── examController.js
│   │   ├── feedbackController.js
│   │   ├── invigilatorController.js
│   │   ├── pdfController.js
│   │   ├── questionPaperController.js
│   │   ├── roleController.js
│   │   ├── roomController.js
│   │   └── studentController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── verifyAdmin.js
│   │   └── verifyStudent.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Allotment.js
│   │   ├── AuditLog.js
│   │   ├── Backup.js
│   │   ├── Chat.js
│   │   ├── EmergencyBroadcast.js
│   │   ├── Exam.js
│   │   ├── Feedback.js
│   │   ├── Invigilator.js
│   │   ├── QuestionPaper.js
│   │   ├── RolePermission.js
│   │   ├── Room.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── allotment.js
│   │   ├── analytics.js
│   │   ├── audit.js
│   │   ├── backup.js
│   │   ├── chat.js
│   │   ├── csv.js
│   │   ├── emergency.js
│   │   ├── exam.js
│   │   ├── feedback.js
│   │   ├── invigilator.js
│   │   ├── pdf.js
│   │   ├── questionPaper.js
│   │   ├── role.js
│   │   ├── room.js
│   │   └── student.js
│   ├── utils/
│   │   ├── allocationLogic.js
│   │   ├── analytics.js
│   │   ├── auditLogger.js
│   │   ├── csvImporter.js
│   │   ├── mailer.js
│   │   ├── pdfGenerator.js
│   │   ├── qrGenerator.js
│   │   ├── smartSeating.js
│   │   └── smsService.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Node.js 18+
- MongoDB 6+

### 1. Clone & Install

```bash
git clone <repository-url>
cd HallEase

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/hallease
JWT_SECRET=your_jwt_secret_key_here

# Email (Gmail SMTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Optional: Twilio for SMS (currently disabled)
# TWILIO_ACCOUNT_SID=your_sid
# TWILIO_AUTH_TOKEN=your_token
# TWILIO_PHONE_NUMBER=your_number
```

### 3. Start Development Servers

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

Access the app at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 📖 API Documentation

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin login |
| `/api/admin/register` | POST | Create admin account |
| `/api/student/login` | POST | Student login |
| `/api/invigilator/login` | POST | Invigilator login |

### Exams
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/exam` | GET | List all exams |
| `/api/exam` | POST | Create new exam |
| `/api/exam/:id` | GET | Get exam details |
| `/api/exam/:id` | PUT | Update exam |
| `/api/exam/:id` | DELETE | Delete exam |

### Rooms (Halls)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/room` | GET | List all rooms |
| `/api/room/add` | POST | Add new room |
| `/api/room/:id` | DELETE | Delete room |
| `/api/room/:roomId/block` | POST | Block seats |
| `/api/room/:roomId/unblock` | POST | Unblock seats |

### Students
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/student` | GET | List students (with filters) |
| `/api/student/add` | POST | Add single student |
| `/api/student/:id` | DELETE | Delete student |
| `/api/csv/upload` | POST | Bulk import via CSV |
| `/api/csv/template` | GET | Download CSV template |

### Allotments
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/allotment/allocate` | POST | Generate seating allocation |
| `/api/allotment/exam/:examId` | GET | View exam allotments |
| `/api/allotment/my` | GET | Student's own allotments |
| `/api/allotment/send-emails/:examId` | POST | Send hall allotment emails |
| `/api/allotment/reset/:examId` | DELETE | Clear exam allotments |

### PDF & QR
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/pdf/seating-chart/:examId` | GET | Download seating chart PDF |
| `/api/pdf/hall-ticket/:studentId/:examId` | GET | Download hall ticket PDF |
| `/api/pdf/qr/:studentId/:examId` | GET | Generate QR code for check-in |
| `/api/pdf/verify-qr` | POST | Verify QR token |

### Analytics & Reports
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analytics/dashboard` | GET | Dashboard statistics |
| `/api/analytics/conflicts` | GET | Exam conflict detection |
| `/api/analytics/export/:type` | GET | CSV export (students/exams/allotments) |
| `/api/audit/logs` | GET | View audit logs |
| `/api/audit/stats` | GET | Activity statistics |

---

## 🎯 User Guide

### For Administrators

1. **Initial Setup**
   - Register an admin account at `/admin/login`
   - Add exam halls with row/column layout
   - Import students via CSV or add individually

2. **Creating Exams**
   - Navigate to "Manage Exams"
   - Create internal or university exams
   - Set date, time, department, and semester

3. **Allocating Seats**
   - Go to "Allocate Halls"
   - Select exam and available rooms
   - System auto-assigns with interleaving algorithm
   - Review and send email notifications

4. **Emergency Broadcasts**
   - Use "Emergency" page for urgent alerts
   - Target by department/semester or all students
   - Track delivery status

### For Students

1. **Login**
   - Use roll number and password at `/student/login`
   - Default password is roll number (change recommended)

2. **View Allotments**
   - Dashboard shows all upcoming exams
   - Each card displays hall, seat, date, time
   - Download hall ticket PDF for each exam

3. **QR Check-in**
   - Show QR code at exam hall entry
   - Invigilator scans to verify identity and seat

---

## � Configuration Options

### Seating Algorithm
Edit `server/utils/allocationLogic.js` to customize:
- Interleaving strategy
- Seat labeling format
- Department grouping rules

### Email Templates
Edit `server/utils/mailer.js` to customize:
- HTML email styling
- Content and branding
- Sender information

### Role Permissions
Edit `server/controllers/roleController.js` to modify:
- Permission sets for each role
- Department restrictions
- Feature access controls

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Developer

Built with ❤️ for educational institutions.

---

**HallEase** – Making exam hall management effortless.

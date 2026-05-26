const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/student', require('./routes/student'));
app.use('/api/room', require('./routes/room'));
app.use('/api/exam', require('./routes/exam'));
app.use('/api/allotment', require('./routes/allotment'));
app.use('/api/invigilator', require('./routes/invigilator'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/csv', require('./routes/csv'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/audit', require('./routes/audit'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/backup', require('./routes/backup'));
app.use('/api/question-paper', require('./routes/questionPaper'));
app.use('/api/role', require('./routes/role'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

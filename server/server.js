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
app.use('/api/auth', require('./routes/auth'));
app.use('/api/class', require('./routes/class'));
app.use('/api/room', require('./routes/room'));
app.use('/api/student', require('./routes/student'));
app.use('/api/allotment', require('./routes/allotment'));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

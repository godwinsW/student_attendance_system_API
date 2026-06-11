require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const connectDB = require("./config/db");
const errorHandler = require('./middleware/error.middleware')
const notFound = require('./middleware/notFound.middleware')
const studentRoutes = require('./routes/student.routes')
const attendanceRoutes = require('./routes/attendance.routes')

const app = express();

// ---- Middleware -------------------------
app.use(cors())
app.use(morgan('dev'))
app.use(express.json());

// --- Routes ------------------------------
app.use('/api/students', studentRoutes)
app.use('/api/attendance', attendanceRoutes)

// --- Not Found ---------------------------
app.use(notFound)

// --- Error Handler -----------------------
app.use(errorHandler)

// --- Start Server ------------------------
const start = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start();
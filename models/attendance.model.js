const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: [true, 'Student reference is required'],
        },
        date: {
            type: Date,
            required: [true, 'Date is required'],
        },
        status: {
            type: String,
            enum: {
                values: ['present', 'absent', 'late'],
                message: "Status must be present, absent, or late",
            },
            required: [true, 'Attendance status is required'],
        }
    }, { timestamps: true }
);

attendanceSchema.index({ student: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('Attendance', attendanceSchema)
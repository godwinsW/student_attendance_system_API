const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        studentId: {
            type: String,
            required: [true, 'Student ID is required'],
            unique: true,
            trim: true,
            uppercase: true
        },
        class: {
            type: String,
            required: [true, 'Class is required'],
            trim: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
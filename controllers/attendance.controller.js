const Attendance = require('../models/attendance.models')
const Student = require('../models/student.model')

// ------ Mark Attendance ---------
const markAttendance = async (req, res, next) => {
    const { studentId, date, status } = req.body;

    try {

        const student = await Student.findOne({ studentId })

        if (!student) {
            return res.status(404).json({
                success: false,
                message: `Student of Student ID ${studentId} not found!`
            })
        }

        const normalisedDate = new Date(date)
        normalisedDate.setUTCHours(0, 0, 0, 0)

        const attendance = await Attendance.create({
            student: studentId,
            date: normalisedDate,
            status
        });

        const populated = await attendance.populate('student')

        res.status(201).json({
            success: true,
            data: populated,
        })

    } catch (error) {
        next(error)
    };
}


// ------ Get Attendance ----------
const getAttendance = async (req, res, next) => {

    const { studentId, date } = req.query
    try {
        const filter = {};

        if (studentId) {
            const student = await Student.findOne({ studentId })

            if (!student) {
                return res.status(404).json({
                    success: false,
                    message: `Student with Student ID ${studentId} not found!`
                })
            }

            filter.student = student._id
        }

        if (date) {
            const normalisedDate = new Date(date)
            normalisedDate.setUTCHours(0, 0, 0, 0)
            filter.date = normalisedDate
        }

        const records = await Attendance.find(filter)
            .populate('student')
            .sort({ date: -1 })

        res.status(200).json({
            success: true,
            count: records.length,
            data: records,
        })
    } catch (error) {
        next(error)
    }
};


// --------- Update Attendance ---------
const updateAttendance = async (req, res) => {

    const { status } = req.body

    try {
        const attendance = await Attendance.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        ).populate('student')

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found'
            })
        }

        res.status(200).json({
            success: true,
            data: attendance,
        })

    } catch (error) {
        next(error)
    }
};


// -------- Delete Attendace ----------
const deleteAttendance = async (req, res) => {
    try {
        const attendance = await Attendance.findByIdAndDelete()

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: 'Attendance record not found!'
            })
        }

        res.status(200).json({
            success: true,
            data: {}
        })

    } catch (error) {
        next(error)
    }
};

module.exports = {
    markAttendance,
    getAttendance,
    updateAttendance,
    deleteAttendance
};
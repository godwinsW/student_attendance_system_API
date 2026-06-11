const Student = require('../models/student.model');

// -------- Create a Student --------------
const createStudent = async (req, res) => {
    const { name, studentId, class: studentClass } = req.body;

    try {
        const student = await Student.create({
            name,
            studentId,
            class: studentClass
        })
        res.status(201).json({
            success: true,
            data: student,
        })
    } catch (error) {
        next(error)
    }
};


// ----- Get All Students --------
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find()
        res.status(200).json({
            success: true,
            count: students.length,
            data: students
        })
    } catch (error) {
        next(error)
    }
};

// ----- Get a Student -----------
const getStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)

        if (!student)
            return res.status(404).json({
                success: false,
                message: 'Student not Found!'
            })
        res.status(200).json({
            success: true,
            data: student
        })

    } catch (error) {
        next(error)
    }
};

// ----- Update a Student ----------
const updateStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not Found!'
            })
        }

        res.status(200).json({
            success: true,
            data: student
        })
    } catch (error) {
        next(error)
    }
};

// ----- Delete a Student ---------
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not Found!'
            })
        }
        res.status(200).json({
            success: true,
            data: {}
        })
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createStudent,
    getAllStudents,
    getStudent,
    updateStudent,
    deleteStudent
};




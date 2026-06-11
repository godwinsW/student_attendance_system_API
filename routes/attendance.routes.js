const express = require('express')
const router = express.Router()

const attendanceController = require('../controllers/attendance.controller')

router.route('/')
    .get(attendanceController.getAttendance)
    .post(attendanceController.markAttendance)

router.route('/:id')
    .put(attendanceController.updateAttendance)
    .delete(attendanceController.deleteAttendance)

module.exports = router;
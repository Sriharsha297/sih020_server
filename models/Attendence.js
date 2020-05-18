const mongoose = require('mongoose')

const attendanceSchema= new mongoose.Schema({
    empId :
    {
        type : String
    },
    branchName :
    {
        type : String,
    },
    totalPresent :
    {
        type : Number,
    },
    leavesLeft :
    {
        type : Number,
    },
    lastSubmitted :{
        type : Number,
    }
})
const Attendance = mongoose.model('Attendance',attendanceSchema)

module.exports = Attendance;


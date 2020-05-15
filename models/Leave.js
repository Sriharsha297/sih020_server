const mongoose = require('mongoose')

const leaveSchema= new mongoose.Schema({
    empId:
    {
        type : String,
    },
    branchName :
    {
        type : String ,
    },
    leaveType : 
    {
        type : String,
    },
    days : 
    {
        type : String,
    },
    date :
    {
        type : String,
    },
    reason :
    {
        type : String,
    }
    
})
const Leave = mongoose.model('Leave',leaveSchema)

module.exports = Leave;


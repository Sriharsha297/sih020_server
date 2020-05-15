const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Attendance = require('../models/Attendence')
const Fence = require('../models/Fence')
const Leave = require('../models/Leave')
// const Employee = require('../models/Employee')
// const auth = require('../middleware/auth')

//login

router.route('/login')
    .post(async (req,res) => {
        // const employee=await Employee.findByCredentials(req.body.empId,req.body.password)
        // const token = await employee.generateAuthToken()
        // res.send({employee:employee,token})  
        res.status(200).json({
            message:"Successful"
        })
    })

//Get Fence

router.route('/getConditions')
.get((req,res) => {
    empId = req.query.empId;
    branchName = req.query.branchName;
    Fence.find({branchName})
    .then((ok) =>{
        Attendance.find({empId})
        .then((attendanceObj)=>{
            lastSubmitted = attendanceObj[0].lastSubmitted;
            res.status(200).json({
                message:"Successful",
                ok,
                lastSubmitted,
            })
        })
        .catch(err =>{
            throw new Error(err);
            
        })
    })
    .catch((err) =>{
        res.status(500).json({
            message:"Internal Server Error"
        })
    }) 
})




// Submit Attendance

router.route('/submitAttendance')
    .post((req,res) => {
        empId = req.query.empId;
        branchName = req.query.branchName;
        var d =new Date();
        var today = d.getDate();
        Attendance.findOne({empId,branchName})
        .then((attendanceObj) => {
            if(!attendanceObj)
            {
                console.log("create");

                Attendance.create({empId,branchName,totalPresent : 1,leavesTaken  : 0 , lastSubmitted : today})
                .then(() =>{
                    res.status(200).json({
                        message:"Successful"
                    })
                })
                .catch(err =>{
                    throw new Error(err);
                })
            }
            else 
            {
                console.log("Update");
            Attendance.updateOne({empId,branchName},{totalPresent : attendanceObj.totalPresent +1,lastSubmitted : today})
            .then(() =>{
                res.status(200).json({
                    message:"Successful"
                })
            })
            .catch(err =>{
                throw new Error(err);
            })
            }

        })
        .catch((err) =>{
            
            res.status(500).json({
                message:"Internal Server Error"
            })
        })
    })

// Submit Leave

router.route('/submitLeave')
    .post((req,res) => {
        Leave.find({empId: req.body.leaveObj.empId , date : req.body.leaveObj.date})
        .then((obj) =>{
            if(obj.length == 0)
            {
                Leave.create(req.body.leaveObj)
                .then(() =>{
                    res.status(200).json({
                        message:"success"
                    })
                })
                .catch(err =>{
                    throw new Error(err);
                })
            }
            else{
                res.status(200).json({
                    message: "exist"
                })
            }
        })
        .catch(err =>{
            res.status(500).json({
                message:"Internal Server Error"
            })
        })
    })

// Leave History

router.route('/leaveHistory')
.get((req,res) => {
    empId = req.query.empId;
    Leave.find({empId,})
    .then((array) =>{
        res.status(200).json({
            message: "success",
            array,
        })
    })
    .catch(err =>{
        res.status(500).json({
            message:"Internal Server Error"
        })
    })
})

// Track Attendance

router.route('/trackAttendance')
.get((req,res) => {
    empId = req.query.empId;
    Attendance.find({empId,})
    .then((array) =>{
        res.status(200).json({
            message: "success",
            array,
        })
    })
    .catch(err =>{
        res.status(500).json({
            message:"Internal Server Error"
        })
    })
})


module.exports = router;
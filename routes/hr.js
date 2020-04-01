/*global google*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fence  = require('../models/Fence');
const Attendance = require('../models/Attendence');
const Employee = require('../models/Employee');

//Login 

router.route('/login')
    .post((req,res) => {
        console.log(req.body)
        if(req.body.username==="harsha" && req.body.password === "harsha"){
            
        }
        res.status(200).json({
            message:"Successful"
        })
    })

//Save Fence

router.route('/saveFence')
.post((req,res) => {
    console.log(req.body)
    branchName = "hyd"
    Fence.findOneAndRemove({branchName},function(err){
    if(err) console.log(err);
        Fence.create({branchName,fence : req.body})
        .then((ok) =>{
            res.status(200).json({
                message:"Successful",
                branchName,
            })
        })
        .catch((err) =>{
            res.status(500).json({
                message:"Internal Server Error"
            })
        })
    }) 
})

//Get Fence

router.route('/getFence')
.get((req,res) => {
    console.log(req.query);
    branchName = req.query.branchName;
    Fence.find({branchName})
    .then((ok) =>{
        res.status(200).json({
            message:"Successful",
            ok,
        })
    })
    .catch((err) =>{
        res.status(500).json({
            message:"Internal Server Error"
        })
    }) 
})

//Remove Fence

router.route('/deleteFence')
.get((req,res) => {
    console.log(req.query);
    branchName = req.query.branchName;
    Fence.findOneAndRemove({branchName},function(err){
        console.log(err)
        res.status(200).json({
            message:"Deleted",
        })
    })
})

// Manual Attendence 

router.route('/manualAttendance')
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
                var d = new Date();
                var date = d.getDate();
                if(date != attendanceObj.lastSubmitted)
                {
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
                else{
                    res.status(500).json({
                        message:"Attendance already Submitted!"
                    })
                }
            }

        })
        .catch((err) =>{
            
            res.status(500).json({
                message:"Internal Server Error"
            })
        })
    })

// Attendance Status

router.route('/attendanceStatus')
    .get((req, res) => {
        branchName = req.query.branchName;
        Attendance.find({ branchName })
            .then((items) => {
                let array = [];
                const getArray = async () => {
                    return Promise.all(
                        await items.map( async item => {
                            var lastSubmitted = item.lastSubmitted;
                            var d = new Date();
                            var date = d.getDate();
                            if (date == lastSubmitted) {
                                status = "present";
                            }
                            else {
                                status = "absent";
                            }
                            try {
                                const emp = await Employee.find({ empId: item.empId });
                                const resObj = {
                                    username: emp[0].username,
                                    empId: emp[0].empId,
                                    totalPresent: item.totalPresent,
                                    leavesTaken: item.leavesTaken,
                                    status,
                                };
                                array.push(resObj);
                                console.log("inside: ", array);
                            } catch(err) {
                                throw new Error(err);
                            }
                        })
                    );
                };
                console.log("outside ", array);
                getArray()
                    .then( () => {
                            res.status(200).json({
                                message: "Successful",
                                array,
                            })
                        }
                    )
                    .catch(err => {
                        throw new Error(err);
                    });
            })
            .catch((err) => {
                console.log(err)
                res.status(500).json({
                    message: "Internal Server Error"
                })
            });
    })

module.exports = router;

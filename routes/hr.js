const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fence  = require('../models/Fence');
const Attendance = require('../models/Attendence');
const Hr = require('../models/Hr')
const Employee = require('../models/Employee');
const Leave = require('../models/Leave')
const auth = require('../middleware/HAuth')

//Login 

router.route('/login')
    .post(async(req,res) => {
        
        try{
            
            const hr=await Hr.findByCredentials(req.body.hrId,req.body.password)
            const token = await hr.generateAuthToken()
            res.status(200).json({
                message : "Sucess",
                hr,
                token
            })   
        }
        catch(e){
            res.status(400).send();
        }
    })

//Save Fence

router.route('/saveFence')
.post(auth,(req,res) => {
    console.log("/saveFence",req.body)
    branchName = req.query.branchName;
    Fence.findOneAndRemove({branchName},function(err){
    if(err) console.log(err);
        Fence.create({branchName,fence : req.body})
        .then((ok) =>{
            console.log('working');
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
.get(auth,(req,res) => {
    console.log('/getFence',req.body);
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
.get(auth,(req,res) => {
    console.log("/deleteFence",req.query);
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
    .post(auth,(req,res) => {
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
    .get(auth,(req, res) => {
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
                                    username: emp[0].name,
                                    empId: emp[0].empId,
                                    totalPresent: item.totalPresent,
                                    leavesLeft: item.leavesLeft,
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

// leaveApplications

router.route('/leaveApplications')
    .get(auth,(req, res) => {
        branchName = req.query.branchName;
        Leave.find({ branchName })
            .then((items) => {
                let array = [];
                const getArray = async () => {
                return Promise.all(
                    await items.map(async item =>{
                        try {
                            const emp = await Employee.find({ empId: item.empId });
                            const attendance = await Attendance.find({empId: item.empId})
                            const resObj = {
                                username: emp[0].name,
                                empId: emp[0].empId,
                                leaveType: item.leaveType,
                                days: item.days,
                                date: item.date,
                                reason: item.reason,
                                appliedOn: item.appliedOn,
                                totalPresent: attendance[0].totalPresent,
                                leavesLeft : attendance[0].leavesLeft,
                                status: item.status,
                                leaveId: item._id,
                            };
                            array.push(resObj);
                        } catch(err) {
                            throw new Error(err);
                        }
                    })
                )}
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

//Accept Leave

router.route('/acceptLeave')
.put((req,res) => {
    empId = req.query.empId;
    Leave.findOneAndUpdate({empId},{status:"Accepted"})
    .then(yo =>{
        Attendance.findOne({empId})
        .then(attendanceObj =>{
            Attendance.updateOne({empId},{leavesLeft:attendanceObj.leavesLeft-1})
            .then(res =>{
                res.status(200).json({
                    message:"Accepted",
                }).catch(err => {
                    throw new Error(err);
                });
            })
        }).catch(err => {
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

//Reject Leave

router.route('/rejectLeave')
.put((req,res) => {
    console.log("hhaa",req.query);
    leaveId = req.query.leaveId;
    Leave.findOneAndUpdate({_id:(leaveId)},{status:"Rejected"},function(err){
        console.log(err)
        res.status(200).json({
            message:"Rejected",
        })
    })
})

// Logout

router.post('/logout',auth,async(req,res)=>{
    console.log("logout",req.headers);
        try{
            req.hr.tokens=req.hr.tokens.filter((token)=>{
                return token.token!== req.token
            })
            await req.hr.save()
            res.send()
        }catch(e){
            res.status(500).send()
        }
    
    })
module.exports = router;

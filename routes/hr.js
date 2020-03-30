/*global google*/

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fence  = require('../models/Fence')

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

module.exports = router;


      // const polygon = new google.maps.Polygon({
      //   paths: res.data,
      // });
      // const currentPosition = new google.maps.LatLng(17.3621969, 78.553551);
      // var insideFence = google.maps.geometry.poly
      // .containsLocation(currentPosition, polygon);
      // console.log(insideFence);
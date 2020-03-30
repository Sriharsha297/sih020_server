const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


//Routes

router.route('/login')
    .post((req,res) => {
        console.log(req.body)
        if(req.body.username==="harsha" && req.body.password === "harsha"){
            
        }
        res.status(200).json({
            message:"Successful"
        })
    })

module.exports = router;
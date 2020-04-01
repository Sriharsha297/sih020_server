const mongoose = require('mongoose')
// const jwt = require('jsonwebtoken')
// const bcrypt = require('bcrypt')

const empSchema=new mongoose.Schema({
    
    empId:{
        type:String
         
    },
    phno:{
        type:String
        
    },
    username:{
        type:String,
       trim:true
    },
    email:
    {
        type:String,
        trim:true,
        unique:true
    },
    password:{
        type:String,
        trim:true
    },
    branch:{
        type:String
        
    },
    tokens: [{
        token : {
            type:String
            
        }
    }]
})


// //token


// empSchema.methods.generateAuthToken=async function () {
//     const employee = this
//     const token = jwt.sign({_id:employee._id.toString()},'randomchar')
//     employee.tokens=employee.tokens.concat({token})
//     await employee.save()
//     return token
// }


// //login


// empSchema.statics.findByCredentials =async (empId,password)=>{
//     const employee=await Employee.findOne({empId})
//     if(!employee)
//     {
//         throw new Error('unable to login')
//     }
//     const isMatch = await bcrypt.compare(password, employee.password)
//     if(!isMatch){
//         throw new Error('unable to login')
//     }
//     return employee
// }


// //hash


// empSchema.pre('save',async function (next) { 
//     const employee=this
    
//     if(employee.isModified('password')){
//         employee.password = await bcrypt.hash(employee.password,8)

//     }
//     next()
// })

const Employee = mongoose.model('Employee',empSchema)
module.exports=Employee
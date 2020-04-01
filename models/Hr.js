const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const hrSchema=new mongoose.Schema({
    hrId:{
        type:String
         
    },
    phno:{
        type:String
        
    },
    name:{
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
        type:String,
        unique:true
        
    },
    tokens: [{
        token : {
            type:String
            
        }
    }]
})
//token
hrSchema.methods.generateAuthToken=async function () {
    const hr = this
    const token = jwt.sign({_id:hr._id.toString()},'randomchar')
    hr.tokens=hr.tokens.concat({token})
    await hr.save()
    return token

}
//login
hrSchema.statics.findByCredentials =async (hrId,password)=>{
    const hr=await Hr.findOne({hrId})
    if(!hr)
    {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, hr.password)
    if(!isMatch){
        throw new Error('unable to login')
    }
    return hr
}
//hash
hrSchema.pre('save',async function (next) { 
    const hr=this
    
    if(hr.isModified('password')){
        hr.password = await bcrypt.hash(hr.password,8)

    }
    next()
})

const Hr = mongoose.model('Hr',hrSchema)
module.exports=Hr
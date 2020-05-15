const jwt = require('jsonwebtoken')
const Hr = require('../models/Hr')

const auth = async (req,res,next)=>{
    try{
        const token= req.header('Authorization').replace('Bearer ','')
        const decoded  = jwt.verify(token,'randomchar')
        const hr = await Hr.findOne({_id:decoded._id,'tokens.token':token})
        if(!hr)
        {
            throw new Error()
        }
        req.token = token
        req.hr=hr
        next()
    }catch(e){
        res.status(401).send({error:'please authenticate'})
    }
    
}
module.exports=auth
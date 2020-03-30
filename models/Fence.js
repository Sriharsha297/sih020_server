const mongoose = require('mongoose')

const fenceSchema= new mongoose.Schema({
    branchName :
    {
        type : String 
    },
    fence :{
        type : []
    }
})
const Fence = mongoose.model('Fence',fenceSchema)

module.exports = Fence;


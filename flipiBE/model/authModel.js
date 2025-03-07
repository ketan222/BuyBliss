const mongoose = require('mongoose')

const authSchema = mongoose.Schema({
    name:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    userId:{
        type:Number,
        default:1,
    }
})

module.exports = mongoose.model("UserCredentials",authSchema);
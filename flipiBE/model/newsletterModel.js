const mongoose = require('mongoose');

const newletterSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model("newsletterdata",newletterSchema);
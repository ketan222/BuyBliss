const CONTACT = require('../model/contactusModel')
const sendMail = require('../utils/mail')

exports.contactus = async(req,res)=>{
    try{
        const {fname,lname,email,message} = req.body;
        if(!fname ||!lname || !email || !message){
            return res.status(400).json({
                success:false,
                message:"Fill all details"
            })
        }
        const newEntry = await CONTACT.create({fname,lname,email,message})
        return res.status(200).json({
            success:true,
            message:"Message Submitted"
        })
    }catch(err){
        console.log(err);
        res.status(400).json({
            success:false,
            message:"Failed"
        })
    }
}
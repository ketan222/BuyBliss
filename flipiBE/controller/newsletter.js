const NEWS = require('../model/newsletterModel')
const sendMail = require('../utils/mail')

exports.newsletterSubmit = async(req,res)=>{
    try{
        const {name,email} = req.body;
        if(!name || !email){
            return res.status(400).json({
                success:false,
                message:"Fill all details"
            })
        }
        const existingmail = await NEWS.findOne({email});
        if(existingmail){
            return res.status(400).json({
                success:false,
                message:"Mail already registered"
            })
        }
        const newEntry = await NEWS.create({name,email});
        await sendMail(newEntry.email,'Thanks for Subscribing!',`We will Update you`);
        res.status(200).json({
            success:true,
            message:"Submitted"
        })
    }catch(err){
        console.log(err);
        res.status(200).json({
            success:true,
            message:"Submitted"
        })
    }
}
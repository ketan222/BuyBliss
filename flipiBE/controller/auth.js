const Auth = require('../model/authModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendMail} = require('../utils/mail')
const crypto = require('crypto');
const { log } = require('console');
require('dotenv').config();

exports.signup = async(req,res)=>{
    // console.log("here");
    try{
        const {name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({
                success:false,
                message:"Fill all details"
            })
        }
        if(password.length < 8){
            return res.status(400).json({
                success:false,
                message:"Must be 8 digits"
            })
        }
        
        const existingUser = await Auth.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already registered"
            })
        }
        let hashPassword;
        try{
            hashPassword = await bcrypt.hash(password,10);
        }catch(err){
            return res.status(400).json({
                success:false,
                message:"Error in hashing"
            })
        }
        const newUser = await Auth.create({name,email,password:hashPassword})
        const token = jwt.sign({ email: newUser.email, _id: newUser.userId}, process.env.JWT_SECRET, { expiresIn: "5h" });
        return res.status(200).json({
            success:true,
            message:"User Created",
            token,
        })
    }catch(err){
        // console.log(err);
        res.status(400).json({
            success:false,
            message:"Failed",
        })
    }
}

exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body;
        const existingUser = await Auth.findOne({email});
        if(!existingUser){
            return res.status(400).json({
                success:false,
                message:"User not Found"
            })
        }
        const isPassEqual = await bcrypt.compare(password,existingUser.password);
        if(!isPassEqual){
            return res.status(400).json({
                success:false,
                message:"Password is incorrect"
            })
        }

        const payload = {
            email:existingUser.email,
            _id:existingUser.userId
        }
        
        const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"5h"})
        return res.status(200).json({
            success:true,
            message:"Logged in",
            token,
            email,
        })
    }catch(err){
        // console.log(err);
        return res.status(400).json({
            success:false,
            message:"Somethig went wrong"
        })
    }
}


const OTP_EXPIRATION_TIME = 5 * 60 * 1000; 
let otpStore = {};
exports.sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const otp = crypto.randomInt(100000, 999999).toString();
        otpStore[email] = { otp, expiresAt: Date.now() + OTP_EXPIRATION_TIME };
                
        await sendMail(
            email,
            'Your OTP for Login',
            `Your OTP is ${otp}`,
            `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`
        );
        // console.log("we entered");                        
           
        return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        // console.error(err);
        // console.log("error");
        return res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json(
                { success: false,
                  message: "Email and OTP are required" 
                });
            }

        const storedOtp = otpStore[email];
        if (!storedOtp || storedOtp.expiresAt < Date.now()) {
            return res.status(400).json(
                { success: false,
                  message: "OTP expired or invalid" 
                });
            }
        if (storedOtp.otp !== otp) {
            return res.status(400).json(
                { success: false,
                  message: "Invalid OTP" 
                });
            }

        delete otpStore[email];

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5h' });

        return res.status(200).json({ success: true, message: "OTP verified", token });
    } catch (err) {
        // console.error(err);
        return res.status(500).json({ success: false, message: "Failed to verify OTP" });
    }
};
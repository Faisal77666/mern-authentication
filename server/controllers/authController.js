import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import UserModel from "../models/userModel.js"
import transporter from "../config/nodemailer.js";
import { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE } from "../config/emailTemplates.js";

export const register=async(req,res)=>{

const {name,email,password}=req.body
if(!name || !email || !password){
  return res.json({success:false ,message:"Missing Details"})
}
  
try{
const existingUser=await UserModel.findOne({email})

if(existingUser){
  return res.json({success:false, message:'User Already exist'})
}

  const hashedPassword=await bcrypt.hash(password,10)

  const user=new UserModel({name,email,password:hashedPassword})
  await user.save()

  const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

  res.cookie('token', token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? "none":"strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })

  //SENDING  WELCOME MESSAGE
  const mailOptions={
    from:process.env.SENDER_EMAIL,
    to:email,
    subject:"Welcome to FullStack",
    text:`Welcome to FullStack website.Your Account has been created with email id: ${email}.`
  }
  
  await transporter.sendMail(mailOptions)
  return res.json({success:true})

}catch(error){
  res.json({success:false,message:error.message})
}

}

export const login=async(req,res)=>{
  const {email,password}=req.body

  if(!email || !password){
    return res.json({succes:false, message:"Email and Password are required"})
  }
try{
  const user=await UserModel.findOne({email})
  if(!user){
    return res.json({succes:false,message:"Invalid Email"})
  }
  const isMatch=await bcrypt.compare(password,user.password)
  if(!isMatch){
    return res.json({success:false,message:'invalid password'})
  }

  const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:'7d'})

  res.cookie('token', token,{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? "none":"strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  return res.json({success:true})

}
catch(error){
  return res.json({success:false,message:error.message});
  
}

}

export const logout=async(req,res)=>{
try {
  res.clearCookie('token',{
    httpOnly:true,
    secure:process.env.NODE_ENV === 'production',
    sameSite:process.env.NODE_ENV === 'production' ? "none":"strict",})
    return res.json({success:true,message:'Logout'})
} catch (error) {
  return res.json({success:false,message:error.message})
}

}

export const sendVerifyOtp=async(req,res)=>{
  try {
    const userId=req.userId
    const user=await UserModel.findById(userId)
    if(user.isAccountVerified){
      return res.json({succes:false,message:"Account Already Verified"})
    }
    const otp=String(Math.floor(100000 + Math.random() * 900000))

  user.verifyOtp=otp
  user.verifyOtpExpireAt=Date.now() +24 * 60 * 60 * 1000
  await user.save()

  const mailOptions={
  from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:"Account Verification OTP",
    // text:`Your OTP is ${otp}.Verify your Account using this OTP. `,
    html:EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
  }
  
  await transporter.sendMail(mailOptions)
  return res.json({success:true,message:'Verification OTP sent on Email'})
  }
catch (error) {
    return res.json({success:false,message:error.message})
    
  }
} 

//Verify Email through otp
export const verifyEmail = async (req, res) => {
  const {otp } = req.body;
  const userId = req.userId;

  if (!userId || !otp) {
    return res.json({ success: false, message: 'Missing details' });
  }

  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    // Compare as strings
    if (!user.verifyOtp || user.verifyOtp !== String(otp)) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP Expired' });
    }

    user.isAccountVerified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: 'Verify Email Success' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export const isAuthenticated=(req,res)=>{
  try {
    return res.json({ success: true})}
catch(error){
    return res.json({ success: false, message: error.message })
  }
}

//Send Reset OTP

export const sendResetOtp=async(req,res)=>{

  const {email}=req.body
  if(!email){
   return res.json({ success: false, message: "Email is Required" })
  }
  try {
    const user=await UserModel.findOne({email})
    if(!user){
      return res.json({ success: false, message: "User not found" })
    }

      const otp=String(Math.floor(100000 + Math.random() * 900000))

  user.resetOtp=otp
  user.resetOtpExpireAt=Date.now() +15 * 60 * 1000
  await user.save()

  const mailOptions={
  from:process.env.SENDER_EMAIL,
    to:user.email,
    subject:"Password Reset OTP",
    // text:`Your OTP for resetting your password is ${otp}.Use this OTP to proceed with resetting your password. `
     html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
  }
  
  await transporter.sendMail(mailOptions)
  return res.json({success:true,message:'OTP sent to your Email'})

    
  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
} 

//Reset Password

export const resetPassword=async(req,res)=>{
const {email,otp,newPassword}=req.body
if(!email || !otp || !newPassword){
  return res.json({success:false,message:"Email,OTP and new password are required"})
}

  try {
    const user=await UserModel.findOne({email})
    if(!user){
      return res.json({success:false,message:"User not found"})
    }
    if(user.resetOtp==="" || user.resetOtp !== otp)
    {
      return res.json({success:false,message:"Invalid OTP"})
    }
    if(user.resetOtpExpireAt<Date.now()){
   return res.json({success:false,message:"OTP Expired"})
    }

    const hashedPassword=await bcrypt.hash(newPassword,10)
    user.password=hashedPassword
    user.resetOtp=""
    user.resetOtpExpireAt=0
    await user.save()
    return res.json({success:true,message:"Password has been reset successfully"})
  } catch (error) {
    
     return res.json({ success: false, message: error.message })
  }
}
import { compareSync, hashSync } from "bcrypt"
import patientModel from "../../../../DB/models/patient.model.js"
import {Decryption,Encryption} from '../../../../utils/encryption.utils.js'
import {emitter} from '../../../../Services/sent-email.service.js'
import { generateToken,verifyToken } from "../../../../utils/token.utils.js"
import {v4 as uuidv4}from 'uuid'
import { Sequelize } from "sequelize"
import blacklistmodel from "../../../../DB/models/blacklist.model.js"




export const signUpService=async(req,res)=>{
    const {patientName,email,DOB,gender,password,phone,bloodtype}=req.body

    const isEmailfound =await patientModel.findOne({email})
    if(isEmailfound){
        return res.status(400).json({message:'email is already exists'})
    }

    const hashpassword=hashSync(password,+process.env.SALT)



    const encryptionPhone=await Encryption({value:phone,secretkey:process.env.ENCRYPTED_KEY_PHONE})



    const otp=Math.floor(100000+Math.random()*900000).toString()
    const hashOtp=hashSync(otp,+process.env.SALT)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    emitter.emit('sendEmail',{
        subject:'confirm your email',
        html:`<h1>${otp}</h1>`,
        to:email,
    })

    const user=new patientModel({
        patientName,
        email,
        DOB,
        gender,
        password:hashpassword,
        phone:encryptionPhone,
        confirmotp:hashOtp,
        otpExpiresAt:otpExpires,
        bloodtype
    })
    await user.save()

    res.status(201).json({message:'signUp susseccfuly'})

}


export const confirmEmail=async(req,res)=>{
    const {otp,email}=req.body

    const user = await patientModel.findOne({
        where: {
            email: email,
            isVerified: false,
            confirmotp: { [Sequelize.Op.ne]: null } 
        }
    });
    if(!user){
        return res.status(400).json({message:'user not found '})
    }
    if (new Date() > user.otpExpiresAt) {
    return res.status(400).json({ message: "OTP has expired, request a new one" });
}

    const validotp=compareSync(otp,user.confirmotp)
    if(!validotp){
        return res.status(400).json({message:'invalid otp'})
    }

    //await patientModel.findByIdAndUpdate(user._id,{isVerified:true,$unset:{confirmotp:'',otpExpiresAt:''}})
    await patientModel.update({
        isVerified:true,
        confirmotp:null,
        otpExpiresAt:null
    },{where:{email:user.email}})

    res.status(200).json({message:'confirm email successfully'})
}

export const resendOtp=async(req,res)=>{
    const {email}=req.body
    //const user =await userModel.findOne({email,isVerified:false,confirmotp:{$exists:true}})
    const user =await patientModel.findOne({
        where:{
            email:email,
            isVerified:false
    }})
    if(!user){
        return res.status(400).json({message:'user not found'})
    }
    if (user.otpExpiresAt && new Date() < user.otpExpiresAt) {
        return res.status(400).json({ message: "OTP already sent. Please wait before requesting a new one." });
    }
    const otp=Math.floor(100000+Math.random()*900000).toString()
    const hashOtp=hashSync(otp,+process.env.SALT)
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    //await userModel.findByIdAndUpdate(user._id,{confirmotp:hashOtp,otpExpiresAt:otpExpires})
    await patientModel.update({confirmotp:hashOtp,otpExpiresAt:otpExpires},{where:{id:user.id}})
    emitter.emit('sendEmail',{
        to:user.email,
        subject:'confirm your email',
        html:`<h1>${otp}</h1>`,
    })
    res.status(201).json({message:'otp send susseccfuly'})
}


export const signInUser=async(req,res)=>{

    const {email,password}=req.body
    const user=await patientModel.findOne({email,isVerified:true})
    if(!user){
        return res.status(400).json({message:'email or password not valid'})
    }

    const ispassword=compareSync(password,user.password)
    if(!ispassword){
        return res.status(400).json({message:'email or password not valid'})
    }
    const accesstoken=generateToken({
        data:{id:user.id,role:user.role},
        sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,
        Options:{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })

    const refreshtoken=generateToken({
        data:{id:user.id,role:user.role},
        sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN,
        Options:{expiresIn:process.env.JWT_REFRESH_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })
    res.status(200).json({message:'login susseccfully',accesstoken,refreshtoken})


}


export const forgetpassword=async(req,res)=>{
    const {email}=req.body
    const user =await patientModel.findOne({where:{email:email}})
    if(!user){
        res.status(400).json({message:'user not found'})
    }
    const otp=Math.floor(100000+Math.random()*900000).toString()
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    const hashOtp=hashSync(otp,+process.env.SALT)

    await patientModel.update({confirmotp:hashOtp,otpExpiresAt:otpExpires},{where:{id:user.id}})
    emitter.emit('sendEmail',{
        to:user.email,
        subject:'otp to reset password',
        html:`<h1>${otp}</h1>`,
    })

    res.status(201).json({message:'otp send susseccfuly look in your email'})

}


export const resetpassword=async(req,res)=>{
    const{otp,email,newpassword,confirmpassword}=req.body
    if(newpassword!==confirmpassword){
        return res.status(400).json({message:'password and confirm password not match'})
    }

    const user =await patientModel.findOne({email:email})
    if(!user){
        return res.status(400).json({message:'user not found'})
    }

    const validOtp = compareSync(otp, user.confirmotp);
    if (!validOtp) {
        return res.status(400).json({ message: 'Invalid OTP' });
    }
    const hashpassword=hashSync(newpassword,+process.env.SALT)

    await patientModel.update({password:hashpassword,confirmotp:null,otpExpiresAt:null},{where:{id:user.id}})

    res.status(200).json({message:'Password successfully resetsword '})
}


export const signout=async(req,res)=>{
    const {accesstoken,refreshtoken}=req.headers
    const verifyaccesstoken=verifyToken({data:accesstoken,sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN})
    const verifyrefreshtoken=verifyToken({data:refreshtoken,sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN})

    const [isAccessTokenBlacklisted, isRefreshTokenBlacklisted] = await Promise.all([
        blacklistmodel.findOne({ where: { tokenid: verifyaccesstoken.jti } }),
        blacklistmodel.findOne({ where: { tokenid: verifyrefreshtoken.jti } })
    ]);

    if(isAccessTokenBlacklisted&&isRefreshTokenBlacklisted){
        return res.status(200).json({message:'already logout'})
    }
    await blacklistmodel.bulkCreate([
        {
            tokenid:verifyaccesstoken.jti,
            expirydata:verifyaccesstoken.exp
        }
        ,
        {
            tokenid:verifyrefreshtoken.jti,
            expirydata:verifyrefreshtoken.exp
        }])
        res.status(200).json({message:'logout susseccfully'})

}

import patientModel from "../../../DB/models/patient.model.js"
import { emitter } from "../../../Services/sent-email.service.js"
import { compareSync, hashSync } from "bcrypt"
import blacklistmodel from "../../../DB/models/blacklist.model.js"



export const updateprofiledata=async(req,res)=>{
    const {id}=req.loggedinuser
    const {patientName,newemail,phone,DOB,bloodtype}=req.body
    
    const patient=await patientModel.findByPk(id)
    if(!patient){
        return res.status(404).json({message:'can not find patient'})
    }

    if(patientName){
        patient.patientName=patientName
    }
    if(phone){
        patient.phone=hashSync(phone,+process.env.SALT)
    }
    if(DOB){
        patient.DOB=DOB
    }
    if(bloodtype){
        patient.bloodtype=bloodtype
    }
    if(newemail){
        const isemailexist=await patientModel.findOne({where:{email:newemail}})

        if(isemailexist){
            return res.status(400).json({message:'email is already exist'})
        }

        const otp=Math.floor(100000+Math.random()*900000).toString()
        const hashOtp=hashSync(otp,+process.env.SALT)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await patientModel.update({
            email:newemail,
            confirmotp:hashOtp,
            otpExpiresAt:otpExpires,
            isVerified:false},

            {where:{id:patient.id}
        })
        emitter.emit('sendEmail',{
            subject:'confirm your email',
            html:`<h1>${otp}</h1>`,
            to:newemail,
        })
    }
    await patient.save()
    res.status(200).json({message:'update profile successfuly if you change update email confirm it by otp'})



}


export const updatepassword=async(req,res)=>{
    const {id}=req.loggedinuser
    const {oldpassword,newpassword,confirmpassword}=req.body

    const patient=await patientModel.findByPk(id)
    if(!patient){
        return res.status(400).json({message:'can not find patient'})
    }

    const ispasswordMatche=compareSync(oldpassword,patient.password)
    if(!ispasswordMatche){
        return res.status(409).json({message:'invalid password'})
    }
    
    const hashpassword=hashSync(newpassword,+process.env.SALT)
    await patientModel.update({password:hashpassword},{where:{id:patient.id}})
    await patient.save()

    await blacklistmodel.create(req.userToken)
    return res.status(200).json({message:'updateed password successfully '})


}
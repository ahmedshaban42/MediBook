import doctormodel from '../../../DB/models/doctors.model.js'
import { compareSync, hashSync } from "bcrypt"
import { Sequelize } from 'sequelize'
import blacklistmodel from '../../../DB/models/blacklist.model.js'

export const confirmEmail=async(req,res)=>{
    const {otp,email}=req.body

    const user = await doctormodel.findOne({
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


    await doctormodel.update({
        isVerified:true,
        confirmotp:null,
        otpExpiresAt:null
    },{where:{email:user.email}})

    res.status(200).json({message:'confirm email successfully'})
}



export const updatepassword=async(req,res)=>{
    const {id}=req.loggedinuser
    const {oldpassword,newpassword,confirmpassword}=req.body

    const doctor=await doctormodel.findByPk(id)
    if(!doctor){
        return res.status(400).json({message:'can not find patient'})
    }

    const ispasswordMatche=compareSync(oldpassword,doctor.password)
    if(!ispasswordMatche){
        return res.status(409).json({message:'invalid password'})
    }
    
    const hashpassword=hashSync(newpassword,+process.env.SALT)
    await doctormodel.update({password:hashpassword},{where:{id:doctor.id}})
    await doctor.save()

    await blacklistmodel.create(req.userToken)
    return res.status(200).json({message:'updateed password successfully '})


}


export const updateprofiledata=async(req,res)=>{
    const {id}=req.loggedinuser
    const {doctorName,newemail,phone,DOB,specialization,experienceYears}=req.body
    
    const doctor=await doctormodel.findByPk(id)
    if(!doctor){
        return res.status(404).json({message:'can not find patient'})
    }

    if(doctorName){
        doctor.doctorName=doctorName
    }
    if(phone){
        doctor.phone=hashSync(phone,+process.env.SALT)
    }
    if(DOB){
        doctor.DOB=DOB
    }
    if(specialization){
        doctor.specialization=specialization
    }
    if(experienceYears){
        doctor.experienceYears=experienceYears
    }
    if(newemail){
        const isemailexist=await doctormodel.findOne({where:{email:newemail}})

        if(isemailexist){
            return res.status(400).json({message:'email is already exist'})
        }

        const otp=Math.floor(100000+Math.random()*900000).toString()
        const hashOtp=hashSync(otp,+process.env.SALT)
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await doctormodel.update({
            email:newemail,
            confirmotp:hashOtp,
            otpExpiresAt:otpExpires,
            isVerified:false},

            {where:{id:patient.id}
        })
        emitter.emit('sendEmail',{
            subject:'confirm your email doctor',
            html:`<h1>${otp}</h1>`,
            to:newemail,
        })
    }
    await doctor.save()
    res.status(200).json({message:'update profile successfuly if you change update email confirm it by otp'})



}
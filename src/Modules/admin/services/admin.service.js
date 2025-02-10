import { hashSync } from 'bcrypt'
import doctormodel from '../../../DB/models/doctors.model.js'
import { Encryption } from '../../../utils/encryption.utils.js'
import { emitter } from '../../../Services/sent-email.service.js'


export const createDoctorAccount=async(req,res)=>{
    const{doctorName,email,password,phone,specialization,experienceYears,DOB,gender}=req.body

    const doctor=await doctormodel.findOne({email})
    if(doctor){
        return res.status(400).json({message:'email is already exists'})
    }

    const hashpassword=hashSync(password,+process.env.SALT)
    const encryptionPhone=await Encryption({value:phone,secretkey:process.env.ENCRYPTED_KEY_PHONE})

    const otp=Math.floor(100000+Math.random()*900000).toString()
    const hashOtp=hashSync(otp,+process.env.SALT)
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    emitter.emit('sendEmail',{
        subject:'confirm your email doctor',
        html:`<h1>${otp}</h1>`,
        to:email,
    })
    
    const newdoctor=new doctormodel({
        doctorName,
        email,
        password:hashpassword,
        phone:encryptionPhone,
        specialization,
        experienceYears,
        DOB,
        gender,
        confirmotp:hashOtp,
        otpExpiresAt:otpExpires,
    })

    await newdoctor.save()
    res.status(201).json({message:'signUp susseccfuly'})


}
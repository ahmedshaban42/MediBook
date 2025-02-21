
import patientModel from "../../../DB/models/patient.model.js"
import { emitter } from "../../../Services/sent-email.service.js"
import { compareSync, hashSync } from "bcrypt"
import blacklistmodel from "../../../DB/models/blacklist.model.js"
import doctormodel from "../../../DB/models/doctors.model.js"
import { Encryption,Decryption } from "../../../utils/encryption.utils.js"
import appointmentModel from "../../../DB/models/appointment.model.js"
import { DateTime } from "luxon";
import { model } from "mongoose"




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


export const getAallDoctors=async(req,res)=>{

    const doctors=await doctormodel.findAll({
        attributes: { exclude: ['password','isVerified','otpExpiresAt','confirmotp','role','updatedAt','createdAt'] }
    })
    if (doctors.length === 0){
        return res.status(404).json({message:'can not find doctors'})
    }
    res.status(200).json({ doctors });


}

export const AppointmentBooking=async(req,res)=>{
    const {id}=req.loggedinuser//patient id
    const {doctor_id ,dateTime,timezone }=req.body

    const patient=await patientModel.findByPk(id)
    if(!patient){
        return res.status(400).json({message:'can not find patient'})
    }

    const doctor=await doctormodel.findByPk(doctor_id)
    if(!doctor){
        return res.status(400).json({message:'can not find doctor'})
    }

    const appointmentTime = DateTime.fromFormat(dateTime, "dd-MM-yyyy hh:mm a", { zone: timezone });
    if (!appointmentTime.isValid) {
        return res.status(400).json({ message: "invalid datetime use this format dd-MM-yyyy hh-mm AM or PM" });
    }

    if (appointmentTime.year !== 2025) {
        return res.status(400).json({ message: "Reservations allowed during the year 2025" });
    }

    const hour = appointmentTime.hour;
    if (hour < 8 || hour >= 20) {
        return res.status(400).json({ message: "Bookings can be made from 8 am to 8 pm" });
    }

    const cairoTime = appointmentTime.setZone("Africa/Cairo").toISO();

    const formattedLocalTime = appointmentTime.toFormat("dd-MM-yyyy hh:mm a");
    const formattedCairoTime = DateTime.fromISO(cairoTime).toFormat("dd-MM-yyyy hh:mm a");


    const booket=await appointmentModel.findOrCreate({
        where:{patient_id:patient.id,doctor_id:doctor.id},
        defaults:{
            doctor_id :doctor.id,
            dateTime:cairoTime,
            patient_id :id
        }
    })
    if(!booket[1]){
        return res.status(400).json({ message:"Appointment Booking already exist"});
    }
    
    
    emitter.emit('sendEmail', {
        subject: 'Your Booking Details',
        html: `
        <h1>Appointment Confirmation</h1>
        <p><strong>Appointment ID:</strong> ${booket[0].id}</p>
        <p><strong>Status:</strong> ${booket[0].appointmentStatus}</p>
        <p><strong>Date & Time:</strong> ${formattedCairoTime} (Cairo Time)</p>
        <p><strong>Patient:</strong> ${patient.patientName}</p>
        <p><strong>Doctor:</strong> ${doctor.doctorName}</p>
        <p><strong>Doctor's Specialty:</strong> ${doctor.specialization}</p>
        <p><i>Please keep this email for your records. If you have any questions, feel free to contact us.</i></p>
        `,
        to: patient.email,
    });

    res.status(200).json({ 
        message:"done",
        localTime: formattedLocalTime + ` (${timezone})`,
        cairoTime: formattedCairoTime + ` (cairo time) `
    });
    
}



export const ModifyBookingDate=async(req,res)=>{
    const {id}=req.loggedinuser
    const {appointmentid,newDateTime,timezone}=req.body
    
    const patient=await patientModel.findByPk(id)
    if(!patient){
        return res.status(400).json({message:'can not find patient'})
    }
    
    const appointment=await appointmentModel.findByPk(appointmentid)
    if(!appointment){
        return res.status(400).json({message:'can not find appointment'})
    }

    const doctor=await doctormodel.findByPk(appointment.doctor_id)
    if(!doctor){
        return res.status(400).json({message:'can not find doctor'})
    }

    const appointmentTime = DateTime.fromFormat(newDateTime, "dd-MM-yyyy hh:mm a", { zone: timezone });
    if (!appointmentTime.isValid) {
        return res.status(400).json({ message: "invalid newDateTime use this format dd-MM-yyyy hh-mm AM or PM" });
    }

    if (appointmentTime.year !== 2025) {
        return res.status(400).json({ message: "Reservations allowed during the year 2025" });
    }

    const hour = appointmentTime.hour;
    if (hour < 8 || hour >= 20) {
        return res.status(400).json({ message: "Bookings can be made from 8 am to 8 pm" });
    }

    const cairoTime = appointmentTime.setZone("Africa/Cairo").toISO();
    console.log(cairoTime)

    const formattedLocalTime = appointmentTime.toFormat("dd-MM-yyyy hh:mm a");
    const formattedCairoTime = DateTime.fromISO(cairoTime).toFormat("dd-MM-yyyy hh:mm a");

    
    await appointmentModel.update({dateTime:cairoTime},{where:{id:appointment.id}})

    res.status(200).json({ 
        message:"done",
        localTime: formattedLocalTime + ` (${timezone})`,
        cairoTime: formattedCairoTime + ` (cairo time) `
    });

    emitter.emit('sendEmail', {
        subject: 'Your Booking Details',
        html: `
        <h1>Appointment Confirmation after update</h1>
        <p><strong>Appointment ID:</strong> ${appointment.id}</p>
        <p><strong>Status:</strong> ${appointment.appointmentStatus}</p>
        <p><strong>Date & Time:</strong> ${formattedCairoTime} (Cairo Time)</p>
        <p><strong>Patient:</strong> ${patient.patientName}</p>
        <p><strong>Doctor:</strong> ${doctor.doctorName}</p>
        <p><strong>Doctor's Specialty:</strong> ${doctor.specialization}</p>
        <p><i>Please keep this email for your records. If you have any questions, feel free to contact us.</i></p>
        `,
        to: patient.email,
    });

}

export const Cancellation=async(req,res)=>{
    const {id}=req.loggedinuser
    const {appointmentid}=req.body
    const patient=await patientModel.findByPk(id)
    if(!patient){
        return res.status(400).json({message:'can not find patient'})
    }

    const appointment=await appointmentModel.findByPk(appointmentid)
    if(!appointment){
        return res.status(400).json({message:'can not find appointment'})
    }
    emitter.emit('sendEmail',{
        subject:'Your booking has been cancelled',
        html:`<h1>You have canceled your appointment with the doctor</h1>`,
        to:patient.email,
    })
    await appointmentModel.destroy({ where: { id: appointmentid } });
    res.status(200).json({ message:"done"})
}

export const getAllAppointments=async(req,res)=>{
    const {id}=req.loggedinuser
    const patient=await patientModel.findByPk(id)
    if(!patient){
        return res.status(400).json({message:"patiant not found"})
    }

    const data=await appointmentModel.findAll({
        where:{
            patient_id:patient.id,
        },
        include:[{
            model:patientModel,
            as:'patientData',
            attributes:['patientName']
        }],
        attributes:{exclude:['createdAt','updatedAt']}
    })
    res.status(200).json({message:"appointments is",data})
}
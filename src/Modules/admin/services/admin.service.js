import { hashSync } from 'bcrypt'
import doctormodel from '../../../DB/models/doctors.model.js'
import { Encryption } from '../../../utils/encryption.utils.js'
import { emitter } from '../../../Services/sent-email.service.js'
import patientModel from '../../../DB/models/patient.model.js'
import appointmentModel from '../../../DB/models/appointment.model.js'
import adminModel from '../../../DB/models/admin.model.js'
import { DateTime } from 'luxon'
import { Op } from 'sequelize'
import { Sequelize } from 'sequelize'
import { compareSync } from "bcrypt"
import { cloudinary } from '../../../config/cloudinary.config.js'

export const createDoctorAccount=async(req,res)=>{
    const{doctorName,email,password,phone,specialization,experienceYears,DOB,gender}=req.body

    const doctor=await doctormodel.findOne({where:{email}})

    if(doctor){
        return res.status(400).json({message:'email is already exists'})
    }

    const hashpassword=hashSync(password,+process.env.SALT)
    
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
        phone,
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


export const BookingReview=async(req,res)=>{
    const {id}=req.loggedinuser
    const {appointmentId}=req.params
    const {message,states}=req.body

    const admin=await adminModel.findByPk(id)
    if(!admin){
        return res.status(400).json({message:"can not find admin"})
    }

    const appointmentData=await appointmentModel.findByPk(appointmentId)
    if(!appointmentData){
        return res.status(400).json({message:"can not find appointment "})
    }
    const patient=await patientModel.findByPk(appointmentData.patient_id)
    if(!patient){
        return res.status(400).json({message:"can not find patient"})
    }

    const doctor=await doctormodel.findByPk(appointmentData.doctor_id)
    if(!doctor){
        return res.status(400).json({message:"can not find doctor"})
    }

    appointmentData.appointmentStatus = states;
    appointmentData.admin_id = admin.id;
    await appointmentData.save();
    
    await appointmentData.reload();

    if(states==='confirmed'){

        emitter.emit("sendEmail",{
            subject:`Your reservation has been ${states}`,
            html: `
            <h1>Appointment Details</h1>
            <p><strong>Appointment ID:</strong> ${appointmentData.id}</p>
            <p><strong>Status:</strong> ${appointmentData.appointmentStatus}</p>
            <p><strong>Date & Time:</strong> ${appointmentData.dateTime} (Cairo Time)</p>
            <p><strong>Patient:</strong> ${patient.patientName}</p>
            <p><strong>Doctor:</strong> ${doctor.doctorName}</p>
            <p><strong>Doctor's Specialty:</strong> ${doctor.specialization}</p>
            <p><strong>Admin Name:</strong> ${admin.adminName}</p>
            <p><i>Please keep this email for your records. If you have any questions, feel free to contact us.</i></p>
            `,
            to:patient.email,
        })

    }else if(states==='canceld'){

        emitter.emit("sendEmail",{
            subject:`Your reservation has been ${states}`,
            html: `
                <h1>We are sorry to ${states} your appointment</h1>
                <p><strong>Reason:</strong> ${message}</p>
            `,
            to:patient.email,
        })

    }


    res.status(201).json({message:'done'})

    

}



export const findAppointmentDoctor=async(req,res)=>{
    const {email:doctorEmail}=req.query

    const doctordata=await doctormodel.findAll({
        where:{email:doctorEmail},
        include:[{
            model:appointmentModel,
            as:'appointmentData',
            attributes:{exclude:['updatedAt','createdAt']}
        }],
        attributes:['id','doctorName','email','specialization']
    })
    return res.status(200).json({ message: "appointments is",doctordata });
}


export const findAppointmentpatient=async(req,res)=>{
    const {email:patientEmail}=req.query

    const patientData=await patientModel.findAll({
        where:{email:patientEmail},
        include:[{
            model:appointmentModel,
            as:'appointmentData',
            attributes:{exclude:['updatedAt','createdAt']},
            include:[{
                model:doctormodel,
                as:'doctorData',
                attributes:['id','doctorName','specialization'],
            }]
        }],
        attributes:['id','patientName','email',]
    })
    return res.status(200).json({ message: "appointments is",patientData });
}





export const getAllAppointmentInday=async(req,res)=>{
    const {id:adminId}=req.loggedinuser
    const {dateTime}=req.query

    const admin=await adminModel.findByPk(adminId)
    if(!admin){
        return res.status(404).json({message:'can not find admin'})
    }

    const appointmentDate = DateTime.fromFormat(dateTime, "yyyy-MM-dd");

    if (!appointmentDate.isValid) {
        return res.status(400).json({ message: "Invalid date format. Use yyyy-MM-dd." });
    }

    const startOfDay = appointmentDate.startOf('day').toJSDate();
    const endOfDay = appointmentDate.endOf('day').toJSDate(); 


    const allAppointments = await appointmentModel.findAll({
            where: {
                dateTime: {
                    [Op.between]: [startOfDay, endOfDay],
                }
            },
            include:[
                {
                    model:patientModel,
                    as:'patientData',
                    attributes:['patientName','phone']
                },
                {
                    model:doctormodel,
                    as:'doctorData',
                    attributes:['doctorName','phone','specialization']
                }
            ],
            attributes:['id','appointmentStatus','dateTime']
        });

    res.status(200).json({message:'Appointment is',allAppointments})
}



export const SearchForADoctorOrPatient=async(req,res)=>{
    const {id:adminId}=req.loggedinuser
    const {query,role}=req.query
    const admin=await adminModel.findByPk(adminId)
    if(!admin){
        return res.status(404).json({message:'can not find admin'})
    }

    

    let data
    if(role==='doctor'){
        data=await doctormodel.findAll({
            where: {
                [Op.or]: [
                    { doctorName: { [Op.like]: `%${query}%` } },
                    { phone: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } }
                ]
            },
            attributes: ['id', 'doctorName', 'phone', 'email','specialization']
        })

    }else if(role==='Patient'){
        data=await patientModel.findAll({
            where: {
                [Op.or]: [
                    { patientName: { [Op.like]: `%${query}%` } },
                    { phone: { [Op.like]: `%${query}%` } },
                    { email: { [Op.like]: `%${query}%` } } 
                ],
                
            },
            attributes: ['id', 'patientName', 'phone', 'email']
        })

    }

    res.status(200).json({message:'result',data})

}


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


export const uploadProfilePictureCloud=async(req,res)=>{
    const {id:adminId}=req.loggedinuser
    const {file}=req
    if(!file){
        return res.status(400).json({message:'no file uploaded'})
    }

    const {secure_url,public_id}=await cloudinary().uploader.upload(file.path,{
        folder:`${process.env.CLOUDINARY_FOLDER}/admin/profilePicture`
    })

    const admin=await adminModel.findByPk(adminId)
    if(!admin){
        return res.status.json({message:'admin not found'})
    }

    const updateAdmin=await admin.update({
        profileImageUrl:secure_url,
        profileImagePublicId:public_id
    })
    res.json({ message: 'admin image updated successfully', updateAdmin});
}



export const uploadCoverPictureCloud=async(req,res)=>{
    const {id:adminId}=req.loggedinuser
    const {file}=req
    if(!file){
        return res.status(400).json({message:'no file uploaded'})
    }

    const {secure_url,public_id}=await cloudinary().uploader.upload(file.path,{
        folder:`${process.env.CLOUDINARY_FOLDER}/admin/coverPicture`
    })

    const admin=await adminModel.findByPk(adminId)
    if(!admin){
        res.status.json({message:'admin not found'})
    }

    const updateAdmin=await admin.update({
        coverImageUrl:secure_url,
        coverImagePublicId:public_id
    })

    res.json({ message: 'admin image updated successfully', updateAdmin});
}



export const deleteProfilePictureCloud=async(req,res)=>{
    const {id:adminId}=req.loggedinuser
    const Admin=await adminModel.findByPk(adminId)
    if(!Admin){
        res.status.json({message:'admin not found'})
    }

    if(Admin.profileImageUrl===null || Admin.profileImagePublicId===null ){
        return res.status(400).json({message:'no profile picture to delete'})
    }

    const AdminProfileImagePublicId=Admin.profileImagePublicId
    const data=await cloudinary().uploader.destroy(AdminProfileImagePublicId)
    if(data.result!=='ok'){
        return res.status(500).json({ message: "Failed to delete profile picture from Cloudinary", error: data });
    }
    await adminModel.update(
        {
            profileImageUrl:null,
            profileImagePublicId:null
        },
        {where:{id:adminId}})
        res.json({ message: 'Admin image delete successfully' });
}








export const deleteCoverPictureCloud=async(req,res)=>{
    const {id:adminId}=req.loggedinuser
    const admin=await adminModel.findByPk(adminId)
    if(!admin){
        return res.status(404).json({message:'admin not found'})
    }

    if(admin.coverImageUrl===null||admin.coverImagePublicId===null){
        return res.status(400).json({message:'no profile picture to delete'})
    }
    const coverImagePublicId=admin.coverImagePublicId
    const data=await cloudinary().uploader.destroy(coverImagePublicId)
    if (data.result !== "ok") {
        return res.status(500).json({ message: "Failed to delete cover picture from Cloudinary", error: data });
    }

    await admin.update({
        coverImageUrl:null,
        coverImagePublicId:null},
        {where:{id:adminId}}
    )
    res.json({ message: 'admin image delete successfully' });
}
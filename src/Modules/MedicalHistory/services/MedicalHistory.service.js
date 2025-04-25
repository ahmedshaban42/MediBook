
import { DATE } from "sequelize";
import appointmentModel from "../../../DB/models/appointment.model.js";
import doctormodel from "../../../DB/models/doctors.model.js";
import MedicalHistoryModel from "../../../DB/models/MedicalHistory.model.js";
import patientModel from "../../../DB/models/patient.model.js";
import { emitter } from "../../../Services/sent-email.service.js";
import { generatePrescriptionHTML } from "../../../utils/htmlForSentprescription.utils.js";
import { generatePDF } from "../../../utils/puppeteer.utiles.js";
import { DateTime } from "luxon";







export const createMedicalHistory =async(req,res)=>{
    const {id:doctor_id}=req.loggedinuser
    const {appointment_id}=req.params
    const {notes,diagnosis,medications,requestedTests}=req.body

    const appointment=await appointmentModel.findByPk(appointment_id)
    if(!appointment){
        return res.status(404).json({message:'appointment not found'})
    }
    const patient_id=appointment.patient_id
    const patient=await patientModel.findByPk(patient_id)
    if(!patient){
        return res.status(404).json({message:'patient not found'})
    }

    const doctor=await doctormodel.findByPk(doctor_id)
    if(!doctor){
        return res.status(404).json({message:'doctor not found'})
    }
    const foundMHforAppointmentModel=await MedicalHistoryModel.findOne({where:{appointment_id}})
    if(foundMHforAppointmentModel){
        return res.status(400).json({message:'this appointment already has Medical History'})
    }

    const newMedicalHistory=new MedicalHistoryModel({
        doctor_id,
        patient_id,
        appointment_id,
        notes,
        diagnosis,
        medications,
        requestedTests
    })
    
    const data={
        appointmentID:appointment.id,
        patientName:patient.patientName,
        doctorName:doctor.doctorName,
        doctorspecialization:doctor.specialization,
        doctorphone:doctor.phone,
        diagnosis,
        notes,
        medications,
        requestedTests
    }
    const html=generatePrescriptionHTML(data)

    const fileName = `prescription-${appointment.id}.pdf`;
    const filePath = await generatePDF(html, fileName);  

    await newMedicalHistory.save()
    emitter.emit("sendEmail",{
        subject: 'Your prescription Details',
        to:patient.email,
        html,
        attachments:[
            {
                filename: fileName,  
                path: filePath  
            }
        ]

    })
    res.status(201).json({message:'Medical history saved',data:newMedicalHistory})
}


export const getMedicalHistoryforDoctorUsingId=async(req,res)=>{
    const {id:doctor_id}=req.loggedinuser
    const {MedicalHistory_id}=req.params

    const MH=await MedicalHistoryModel.findOne(
        {
            where:{
                id:MedicalHistory_id,doctor_id
            },
            include:[
                { 
                    model: patientModel  ,
                    as : 'patientData',
                    attributes:['id','patientName','phone','gender','bloodtype','DOB'] 
                },
                { 
                    model: appointmentModel,
                    as: 'appointmentData',
                    attributes:['id','dateTime']
                }
            ],
            attributes:['id','notes','diagnosis','medications','requestedTests']
        }

    )
    if(!MH){
        return res.status(404).json({message:'MedicalHistory not found'})
    }
    res.status(200).json({message:'Medical history data',data:MH})
} 

export const getAllMedicalHistoryforDoctor=async(req,res)=>{
    const {id:doctor_id}=req.loggedinuser
    const MH=await MedicalHistoryModel.findAll(
        {
            where:{
                doctor_id
            },
            include:[
                { 
                    model: patientModel  ,
                    as : 'patientData',
                    attributes:['id','patientName','phone','gender','bloodtype','DOB'] 
                },
                { 
                    model: appointmentModel,
                    as: 'appointmentData',
                    attributes:['id','dateTime']
                }
            ],
            attributes:['id','notes','diagnosis','medications','requestedTests']
        }
    )
    if(!MH){
        return res.status(404).json({message:'MedicalHistory not found'})
    }
    res.status(200).json({message:'Medical history data',data:MH})
}

export const getMedicalHistoryforPatientUsingId=async(req,res)=>{
    const {id:patient_id}=req.loggedinuser
    const {MedicalHistory_id}=req.params

    const MH=await MedicalHistoryModel.findOne({
        where:{
            id:MedicalHistory_id,
            patient_id
        },
        include:[
            {
                model:patientModel,
                as:'patientData',
                attributes:['id','patientName','phone','gender','bloodtype','DOB'] 
            },
            {
                model:doctormodel,
                as:'doctorData',
                attributes:['id','doctorName','email','phone','specialization','DOB','gender'] 
            },
            {
                model:appointmentModel,
                as:"appointmentData",
                attributes:['id','dateTime']
            }
        ],
        attributes:['id','notes','diagnosis','medications','requestedTests']
    })
    if(!MH){
        return res.status(404).json({message:'MedicalHistory not found'})
    }
    res.status(200).json({message:'Medical history data',data:MH})
}

export const getAllMedicalHistoryforPatient=async(req,res)=>{
    const {id:patient_id}=req.loggedinuser

    const MH=await MedicalHistoryModel.findAll({
        where:{
            patient_id
        },
        include:[
            {
                model:patientModel,
                as:'patientData',
                attributes:['id','patientName','phone','gender','bloodtype','DOB'] 
            },
            {
                model:doctormodel,
                as:'doctorData',
                attributes:['id','doctorName','email','phone','specialization','DOB','gender'] 
            },
            {
                model:appointmentModel,
                as:"appointmentData",
                attributes:['id','dateTime']
            }
        ],
        attributes:['id','notes','diagnosis','medications','requestedTests']
    })
    if(!MH){
        return res.status(404).json({message:'MedicalHistory not found'})
    }
    res.status(200).json({message:'Medical history data',data:MH})
}


export const getMedicalHistoryForAdmin =async(req,res)=>{
    const {MedicalHistory_id,doctor_id,patient_id}=req.query
    const filter={}
    if(MedicalHistory_id)filter.id=MedicalHistory_id
    if(doctor_id)filter.doctor_id=doctor_id
    if(patient_id)filter.patient_id=patient_id

    const MH=await MedicalHistoryModel.findAll(
        {
            where:filter,
            include:[
                {
                    model:patientModel,
                    as:'patientData',
                    attributes:['id','patientName','phone','gender','bloodtype','DOB'] 
                },
                {
                    model:doctormodel,
                    as:'doctorData',
                    attributes:['id','doctorName','email','phone','specialization','DOB','gender'] 
                },
                {
                    model:appointmentModel,
                    as:"appointmentData",
                    attributes:['id','dateTime']
                }
            ],
            attributes:['id','notes','diagnosis','medications','requestedTests']
        },
)

    if(!MH || MH.length===0){
        return res.status(404).json({message:'Medical History not found'})
    }
    res.status(200).json({message:'Medical history data',data:MH})
}


export const updateMedicalHistory=async(req,res)=>{
    const {id:doctorid}=req.loggedinuser
    const {MedicalHistoryid}=req.params
    const {notes,diagnosis,medications,requestedTests}=req.body
    const MH=await MedicalHistoryModel.findOne({where:{id:MedicalHistoryid,doctor_id:doctorid}})
    if(!MH){
        return res.status(404).json({message:'medical history not found'})
    }

    if(notes){
        MH.notes=notes
    }
    if(diagnosis){
        MH.diagnosis=diagnosis
    }
    if(medications){
        MH.medications=medications
    }
    if(requestedTests){
        MH.requestedTests=requestedTests
    }
    await MH.save()
    return res.status(200).json({ message: 'Medical history updated successfully', data: MH })
}
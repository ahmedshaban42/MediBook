import { cloudinary } from "../../../config/cloudinary.config.js";
import appointmentModel from "../../../DB/models/appointment.model.js";
import appointmentFileModel from "../../../DB/models/appointmentFile.models.js";



export const uploadAppointmentFiles =async(req,res)=>{
    const{id:patientid}=req.loggedinuser
    const {Appointmentid,fileType}=req.body
    const {files}=req

    if(!files || files.length===0){
        return res.status(400).json({ message: 'No files uploaded' });
    }
    const appointment=await appointmentModel.findByPk(Appointmentid)
    if(!appointment){
        return res.status(400).json({ message: 'can not find appointment'});
    }

    if (appointment.patient_id !== patientid) {
        return res.status(403).json({ 
            message: 'You are not authorized to upload files for this appointment.' 
        });
    }

    const uploadfiles=[]
    
    for(const file of files){

        const { secure_url, public_id }=await cloudinary().uploader.upload(file.path,{
            folder:`${process.env.CLOUDINARY_FOLDER}/appointmentsFiles/patient${Appointmentid}`
        })

        const fileRecord=await appointmentFileModel.create({
            appointmentId:appointment.id,
            fileurl:secure_url,
            filePublicId:public_id,
            fileName:file.originalname,
            fileType
        })
        uploadfiles.push(fileRecord)
    }
    res.json({ message: 'Files uploaded successfully'});

}
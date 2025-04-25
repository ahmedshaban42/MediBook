import { appointmentStatus } from "../constants/constants.js"
import appointmentModel from "../DB/models/appointment.model.js"


export const checkConfirmedAppointment=()=>{
    return async (req,res,next)=>{
        const {appointment_id}=req.params
        const appointment=await appointmentModel.findByPk(appointment_id)
        if(!appointment){
            return res.status(404).json({message:'appointment not found'})
        }
        if(appointment.appointmentStatus!==appointmentStatus.CONFIRMED){
            return res.status(400).json({ message: 'Appointment is not confirmed by admin' });
        }
        next();
    }
}
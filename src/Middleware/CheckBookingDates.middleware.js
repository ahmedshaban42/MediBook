import appointmentModel from "../DB/models/appointment.model.js"
import { Op } from "sequelize";
import { DateTime } from "luxon";

export const CheckBookingDates=()=>{
    return async (req,res,next)=>{
        const {dateTime,doctor_id,timezone}=req.body

        const datenow = DateTime.now().startOf('day');
        
        
        const appointmentTime = DateTime.fromFormat(dateTime, "dd-MM-yyyy hh:mm a", { zone: timezone });
        if (!appointmentTime.isValid) {
            return res.status(400).json({ message: "Invalid datetime format. Use dd-MM-yyyy hh-mm AM or PM" });
        }
        
        const appointmentDateOnly = appointmentTime.startOf('day');
        if(datenow.ts>=appointmentDateOnly.ts){
            return res.status(400).json({ message: "Please book future appointments" });
        }

        
        const existingBooking = await appointmentModel.findOne({
            where: {
                doctor_id,
                dateTime: {
                    [Op.between]: [
                        new Date(appointmentTime.toJSDate().getTime() - 30 * 60000), 
                        new Date(appointmentTime.toJSDate().getTime() + 30 * 60000) 
                    ]
                }
            }
        });

        if (existingBooking) {
            return res.status(400).json({ message: "The doctor already has an appointment within 30 minutes of this time" });
        }

        const appointmentDate = appointmentTime.toJSDate();
        const startOfDay = DateTime.fromJSDate(appointmentDate).startOf('day').toJSDate();
        const endOfDay = DateTime.fromJSDate(appointmentDate).endOf('day').toJSDate();
        console.log(startOfDay,endOfDay)


        const maxBooking=await appointmentModel.findAndCountAll({where:{
            doctor_id,
            dateTime:{[Op.between]: [startOfDay, endOfDay]}
            }
        })
        console.log(maxBooking)
        if(maxBooking.count>=5){
            return res.status(400).json({ message: "Please select another day for your reservation to be completed on this day" });
        }
        next()
    }
}
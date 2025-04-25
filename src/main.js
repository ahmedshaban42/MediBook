import express from 'express'
import { connection } from './DB/conection.js'
import cors from "cors"

import path from 'path'
import { config } from 'dotenv'
config({path:path.resolve(`src/config/.${process.env.NODE_ENV}.env`)})
console.log(path.resolve(`src/config/.${process.env.NODE_ENV}.env`))

import routerhandellar from './utils/router-handrller.utils.js'
import patientModel from './DB/models/patient.model.js'
import doctormodel from './DB/models/doctors.model.js'
import adminModel from './DB/models/admin.model.js'
import appointmentModel from './DB/models/appointment.model.js'
import MedicalHistoryModel from './DB/models/MedicalHistory.model.js'
import ratingModel from './DB/models/ratings.model.js'
import appointmentFileModel from './DB/models/appointmentFile.models.js'


const whitList=[process.env.FRONTEND_ORIGIN]
const corsOptions={
    origin:function(origin,callback){
        if(!origin || whitList.includes(origin)){
            callback(null,true)
        }else{
            console.log(`Blocked CORS request from: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    }
}


const bootstrab=()=>{
    const app=express()
    const port=process.env.PORT

    connection()
    
    patientModel
    doctormodel
    adminModel
    appointmentModel
    MedicalHistoryModel
    ratingModel
    appointmentFileModel

    app.use(express.json())
    app.use(cors(corsOptions))

    routerhandellar(app)



    app.listen(process.env.PORT,()=>{
        console.log(`server work in port ${port} successfuly` )
    })
}
export default bootstrab
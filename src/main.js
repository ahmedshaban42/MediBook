import express from 'express'
import { connection } from './DB/conection.js'

import path from 'path'
import { config } from 'dotenv'
config({path:path.resolve(`src/config/.${process.env.NODE_ENV}.env`)})
console.log(path.resolve(`src/config/.${process.env.NODE_ENV}.env`))

import routerhandellar from './utils/router-handrller.utils.js'
import patientModel from './DB/models/patient.model.js'
import doctormodel from './DB/models/doctors.model.js'
import adminModel from './DB/models/admin.model.js'
import appointmentModel from './DB/models/appointment.model.js'

const bootstrab=()=>{
    const app=express()
    const port=process.env.PORT

    connection()
    
    patientModel
    doctormodel
    adminModel
    appointmentModel

    app.use(express.json())

    routerhandellar(app)



    app.listen(process.env.PORT,()=>{
        console.log(`server work in port ${port} successfuly` )
    })
}
export default bootstrab
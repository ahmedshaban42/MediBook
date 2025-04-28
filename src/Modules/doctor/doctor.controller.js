import { Router } from "express";
const doctor=Router()

import {
    getAllDoctors,updateprofiledata,updatepassword,
    completeAppointment,getAllAppointmentInday}from './services/doctor.service.js'

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";

import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";

import doctormodel from "../../DB/models/doctors.model.js";





doctor.get('/doctors',
    errorHandler(getAllDoctors)
)



doctor.put('/update-profile-data',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(updateprofiledata)
)

doctor.put('/update-password',
    errorHandler(authenticationMiddleware(doctormodel)),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(updatepassword)
)

doctor.patch('/completed-appointmentStatus/:appointmentId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(completeAppointment)
)

doctor.get('/get-All-Appointment-In-day',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(getAllAppointmentInday)
)




export default doctor
import { Router } from "express";
const doctor=Router()

import {confirmEmail,updateprofiledata,updatepassword,completeAppointment,getAllAppointmentInday}from './services/doctor.service.js'

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";

import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";

import doctormodel from "../../DB/models/doctors.model.js";







doctor.post('/confirm-doctor-account',
    errorHandler(authenticationMiddleware(doctormodel)),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(confirmEmail))

doctor.put('/update-profile-data',
    errorHandler(authenticationMiddleware(doctormodel)),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(updateprofiledata)
)

doctor.put('/update-password',
    errorHandler(authenticationMiddleware(doctormodel)),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(updatepassword)
)

doctor.patch('/completed-appointmentStatus/:appointmentId',
    errorHandler(authenticationMiddleware(doctormodel)),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(completeAppointment)
)

doctor.get('/get-All-Appointment-In-day',
    errorHandler(authenticationMiddleware(doctormodel)),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(getAllAppointmentInday)
)




export default doctor
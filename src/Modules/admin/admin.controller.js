import { Router } from "express";
const admin=Router()
import {confirmEmail,createDoctorAccount,BookingReview,findAppointmentDoctor,findAppointmentpatient,getAllAppointmentInday,SearchForADoctorOrPatient}from './services/admin.service.js'

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";

import adminModel from "../../DB/models/admin.model.js";



admin.post('/admin-create-doctor-account',
    errorHandler(authenticationMiddleware(adminModel)),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(createDoctorAccount))



admin.put('/Booking-Review/:appointmentId',
    errorHandler(authenticationMiddleware(adminModel)),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(BookingReview)
)    


admin.get('/findAppointmentDoctor',
    errorHandler(authenticationMiddleware(adminModel)),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(findAppointmentDoctor)
)

admin.get('/findAppointmentpatient',
    errorHandler(authenticationMiddleware(adminModel)),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(findAppointmentpatient)
)

admin.get('/getAllAppointmentInday',
    errorHandler(authenticationMiddleware(adminModel)),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(getAllAppointmentInday)
)



admin.get('/Search-for-a-doctor-or-patient',
    errorHandler(authenticationMiddleware(adminModel)),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(SearchForADoctorOrPatient)
)

admin.post('/confirm-doctor-account',
    errorHandler(authenticationMiddleware(adminModel)),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(confirmEmail)
)
export default admin
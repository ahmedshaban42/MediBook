import { Router } from "express";
import { updateprofiledata,updatepassword,getAallDoctors,AppointmentBooking,ModifyBookingDate,Cancellation,getAllAppointments } from "./services/user.service.js";
import {errorHandler}from '../../Middleware/error-handeller.middleware.js'
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import patientModel from '../../DB/models/patient.model.js'
import {CheckBookingDates}from '../../Middleware/CheckBookingDates.middleware.js'

const user=Router()



user.patch('/update-patient-profile',
    errorHandler(authenticationMiddleware(patientModel)), 
    errorHandler(authorizationMiddleware('patient')), 
    errorHandler(updateprofiledata) 
);

user.put('/update-patient-password',
    errorHandler(authenticationMiddleware(patientModel)),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(updatepassword)
)

user.get('/get-all-doctors',
    errorHandler(authenticationMiddleware(patientModel)),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(getAallDoctors)
)

user.post('/Appointment-Booking',
    errorHandler(authenticationMiddleware(patientModel)),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(CheckBookingDates()),
    errorHandler(AppointmentBooking)
)

user.patch("/Modify-Booking-Date",
    errorHandler(authenticationMiddleware(patientModel)),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(ModifyBookingDate)
)

user.delete("/Cancellation",
    errorHandler(authenticationMiddleware(patientModel)),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(Cancellation)
)


user.get('/get-all-appointments',
    errorHandler(authenticationMiddleware(patientModel)),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(getAllAppointments)
)





export default user
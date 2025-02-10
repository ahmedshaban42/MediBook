import { Router } from "express";
const doctor=Router()

import {confirmEmail,updateprofiledata,updatepassword}from './services/doctor.service.js'

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";

import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";

import doctormodel from "../../DB/models/doctors.model.js";







doctor.post('/confirm-doctor-account',errorHandler(confirmEmail))

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



export default doctor
import { Router } from "express";
import { updateprofiledata,updatepassword } from "./services/user.service.js";
import {errorHandler}from '../../Middleware/error-handeller.middleware.js'
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import patientModel from '../../DB/models/patient.model.js'

const user=Router()



user.patch('/update-patient-profile',

    errorHandler(authenticationMiddleware(patientModel)),
    errorHandler(updateprofiledata))

user.put('/update-patient-password',
    errorHandler(authenticationMiddleware(patientModel)),
    errorHandler(updatepassword)
)






export default user
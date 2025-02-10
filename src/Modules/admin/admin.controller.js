import { Router } from "express";
const admin=Router()
import {createDoctorAccount}from './services/admin.service.js'

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";

import adminModel from "../../DB/models/admin.model.js";



admin.post('/admin-create-doctor-account',
    errorHandler(authenticationMiddleware(adminModel)),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(createDoctorAccount))

export default admin
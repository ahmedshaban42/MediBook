import { Router } from "express";
const authDoctor=Router()
import {signInDoctor,signoutDoctor}from './services/authentication-doctor.service.js'
import { errorHandler } from '../../../Middleware/error-handeller.middleware.js'

authDoctor.post("/login-doctor",errorHandler(signInDoctor))
authDoctor.post('/signout-Doctor',errorHandler(signoutDoctor))


export default authDoctor
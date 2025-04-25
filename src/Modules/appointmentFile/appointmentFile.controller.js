import { Router } from "express";


const appointmentFile=Router()

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";

import { MulterCloud } from "../../Middleware/cloudinary.Middleware.js";
import { allowExtentionns } from "../../constants/constants.js";

import {uploadAppointmentFiles}from './services/appointmentFile.service.js'


appointmentFile.post('/upload-files-to-appoiment',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    MulterCloud(allowExtentionns).array('files',5),
    errorHandler(uploadAppointmentFiles)
)
export default appointmentFile
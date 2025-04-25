import { Router } from "express";
const rating=Router()

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";

import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";


import {addRatind,getDoctorRating,getAllRatings,deleteRating}from './services/rating.service.js'
import patientModel from "../../DB/models/patient.model.js";
import adminModel from "../../DB/models/admin.model.js";
import { roles } from "../../constants/constants.js";




rating.post('/add-rating/:doctor_id',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(addRatind)
)

rating.get('/get-all-rating-doctor/:doctorid',
    errorHandler(getDoctorRating)
)

rating.get('/get-all-rating',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(getAllRatings)
)

rating.delete('/delete-rating/:ratingid',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware(roles.Admin)),
    errorHandler(deleteRating)
)
export default rating
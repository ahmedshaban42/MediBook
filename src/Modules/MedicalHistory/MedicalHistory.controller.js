import { Router } from "express";
const MedicalHistory=Router()


import { errorHandler } from "../../Middleware/error-handeller.middleware.js";

import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import doctormodel from "../../DB/models/doctors.model.js";
import {
    createMedicalHistory,getMedicalHistoryforDoctorUsingId,getAllMedicalHistoryforDoctor,
    getMedicalHistoryforPatientUsingId,getAllMedicalHistoryforPatient,getMedicalHistoryForAdmin,
    updateMedicalHistory
}from './services/MedicalHistory.service.js'
import patientModel from "../../DB/models/patient.model.js";
import adminModel from "../../DB/models/admin.model.js";
import { checkConfirmedAppointment } from "../../Middleware/checkConfirmedAppointment.middleware.js";

//doctor
MedicalHistory.post('/create-medical-history/:appointment_id',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(checkConfirmedAppointment()),
    errorHandler(createMedicalHistory)
)

MedicalHistory.get('/find-medical-history/:MedicalHistory_id',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(getMedicalHistoryforDoctorUsingId)
)

MedicalHistory.get('/find-all-medical-history',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(getAllMedicalHistoryforDoctor)
)
//patient

MedicalHistory.get('/patient-medical-history/:MedicalHistory_id',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(getMedicalHistoryforPatientUsingId)
)

MedicalHistory.get('/patient-All-medical-history',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(getAllMedicalHistoryforPatient)
)

MedicalHistory.get('/admin-medical-history',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(getMedicalHistoryForAdmin)
)
MedicalHistory.put('/update-medical-history/:MedicalHistoryid',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('doctor')),
    errorHandler(updateMedicalHistory)
)
export default MedicalHistory
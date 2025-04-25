import { Router } from "express";
const admin=Router()
import {
    confirmEmail,createDoctorAccount,BookingReview,findAppointmentDoctor,
    findAppointmentpatient,getAllAppointmentInday,uploadCoverPictureCloud,
    SearchForADoctorOrPatient,deleteCoverPictureCloud,uploadProfilePictureCloud,
    deleteProfilePictureCloud
}from './services/admin.service.js'

import { errorHandler } from "../../Middleware/error-handeller.middleware.js";
import { authenticationMiddleware,authorizationMiddleware } from "../../Middleware/authentication.middleware.js";
import { MulterCloud } from "../../Middleware/cloudinary.Middleware.js";
import { allowExtentionns } from "../../constants/constants.js";





admin.post('/admin-create-doctor-account',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(createDoctorAccount))

admin.put('/Booking-Review/:appointmentId',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(BookingReview)
)    


admin.get('/findAppointmentDoctor',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(findAppointmentDoctor)
)

admin.get('/findAppointmentpatient',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(findAppointmentpatient)
)

admin.get('/getAllAppointmentInday',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(getAllAppointmentInday)
)

admin.get('/Search-for-a-doctor-or-patient',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(SearchForADoctorOrPatient)
)

admin.post('/confirm-doctor-account',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(confirmEmail)
)

admin.post('/upload-profile-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    MulterCloud(allowExtentionns).single('profile'),
    errorHandler(uploadProfilePictureCloud)
)

admin.post('/upload-cover-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    MulterCloud(allowExtentionns).single('cover'),
    errorHandler(uploadCoverPictureCloud)
)


admin.delete('/delete-profile-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(deleteProfilePictureCloud)
)


admin.delete('/delete-cover-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('admin')),
    errorHandler(deleteCoverPictureCloud)
)
export default admin
import { Router } from "express";
import {    
    updateprofiledata,updatepassword,getAallDoctors,AppointmentBooking,
    ModifyBookingDate,Cancellation,getAllAppointments,uploadProfilePictureCloud,
    uploadCoverPictureCloud,deleteProfilePictureCloud,deleteCoverPictureCloud
} from "./services/user.service.js";


import {errorHandler}from '../../Middleware/error-handeller.middleware.js'
import {authenticationMiddleware,authorizationMiddleware}from '../../Middleware/authentication.middleware.js'
import { validationMW } from "../../Middleware/validation.middleware.js";
import {CheckBookingDates}from '../../Middleware/CheckBookingDates.middleware.js'
import { MulterCloud } from "../../Middleware/cloudinary.Middleware.js";
import { allowExtentionns } from "../../constants/constants.js";
import { 
    updateprofiledataSchema,updatepasswordSchema,
    AppointmentBookingSchema,ModifyBookingDateSchema,CancellationSchema, 
} from "../../Validators/user-schema.js";
const user=Router()



user.patch('/update-patient-profile',
    errorHandler(authenticationMiddleware()), 
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(validationMW(updateprofiledataSchema)),
    errorHandler(updateprofiledata) 
);

user.put('/update-patient-password',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(validationMW(updatepasswordSchema)),
    errorHandler(updatepassword)
)

user.get('/get-all-doctors',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(getAallDoctors)
)

user.post('/Appointment-Booking',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    //errorHandler(validationMW(AppointmentBookingSchema)),
    errorHandler(CheckBookingDates()),
    errorHandler(AppointmentBooking)
)

user.patch("/Modify-Booking-Date",
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(validationMW(ModifyBookingDateSchema)),
    errorHandler(ModifyBookingDate)
)

user.delete("/Cancellation",
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(validationMW(CancellationSchema)),
    errorHandler(Cancellation)
)


user.get('/get-all-appointments',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(getAllAppointments)
)

user.post('/upload-profile-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    //errorHandler(validationMW(profileImageSchema)),
    MulterCloud(allowExtentionns).single('profile'),
    errorHandler(uploadProfilePictureCloud)
)


user.post('/upload-cover-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    MulterCloud(allowExtentionns).single('cover'),
    errorHandler(uploadCoverPictureCloud)
)




user.delete('/delete-profile-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(deleteProfilePictureCloud)
)


user.delete('/delete-cover-picture-cloud',
    errorHandler(authenticationMiddleware()),
    errorHandler(authorizationMiddleware('patient')),
    errorHandler(deleteCoverPictureCloud)
)
export default user
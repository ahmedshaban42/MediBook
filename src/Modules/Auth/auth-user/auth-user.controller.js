import { Router } from 'express'

import{
    signUpService,confirmEmail,resendOtp,
    signInUser,forgetpassword,resetpassword,signout
}from './services/authentication-user.service.js'

import {validationMW} from '../../../Middleware/validation.middleware.js'
import {errorHandler}from '../../../Middleware/error-handeller.middleware.js'
import { 
    signUpSchema,confirmEmailSchema,resendOtpSchema,signInUserSchema,
    forgetpasswordSchema,resetpasswordSchema,signoutSchema
}from '../../../Validators/auth-user-schema.js'


const authRoterUser=Router()

authRoterUser.post('/signUp-user',
    errorHandler(validationMW(signUpSchema)),
    errorHandler(signUpService))


authRoterUser.post('/confirm-email',
    errorHandler(validationMW(confirmEmailSchema)),
    errorHandler(confirmEmail))


authRoterUser.post('/resend-otp',
    errorHandler(validationMW(resendOtpSchema)),
    errorHandler(resendOtp))


authRoterUser.post('/login-user',
    errorHandler(validationMW(signInUserSchema)),
    errorHandler(signInUser))



authRoterUser.post('/forget-password',
    errorHandler(validationMW(forgetpasswordSchema)),
    errorHandler(forgetpassword))


authRoterUser.put('/reset-password',
    errorHandler(validationMW(resetpasswordSchema)),
    errorHandler(resetpassword))

authRoterUser.post('/signout-user',
    errorHandler(validationMW(signoutSchema)),
    errorHandler(signout))

export default authRoterUser
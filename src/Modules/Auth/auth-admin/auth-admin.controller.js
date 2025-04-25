import { Router } from 'express'
import {signInadmin,signoutadmin}from './services/authentication-admin.service.js'
import { errorHandler } from '../../../Middleware/error-handeller.middleware.js'
import {validationMW}from '../../../Middleware/validation.middleware.js'
import { signInadminSchema } from '../../../Validators/auth-admin.schema.js'
const authadmin=Router()






authadmin.post('/login-admin',
    errorHandler(validationMW(signInadminSchema)),
    errorHandler(signInadmin)
)


authadmin.post('/signout-admin',
    
    errorHandler(signoutadmin))





export default authadmin
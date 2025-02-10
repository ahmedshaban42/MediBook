import { Router } from 'express'
import {signInadmin,signoutadmin}from './services/authentication-admin.service.js'
import { errorHandler } from '../../../Middleware/error-handeller.middleware.js'
const authadmin=Router()






authadmin.post('/login-admin',errorHandler(signInadmin))
authadmin.post('/signout-admin',errorHandler(signoutadmin))





export default authadmin
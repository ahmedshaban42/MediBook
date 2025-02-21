import usercontroller from '../Modules/user/user.controller.js'
import {globalhandelrMW} from '../Middleware/error-handeller.middleware.js'
import authUsercontroller from '../Modules/Auth/auth-user/auth-user.controller.js'

import authadmincontroller from '../Modules/Auth/auth-admin/auth-admin.controller.js'
import admincontroller from '../Modules/admin/admin.controller.js'


import authDoctorcontroller from '../Modules/Auth/auth-doctor/auth-doctor.controller.js'
import doctorcontroller from '../Modules/doctor/doctor.controller.js'

import {rateLimit}from 'express-rate-limit'

const limit=rateLimit({
    windowMs:15*60*1000,
    limit:100,
    message:'to many request',
    legacyHeaders:false
})

const routerhandellar=(app)=>{
    app.use(limit)

    app.use('/auth-admin',authadmincontroller)
    app.use('/admin',admincontroller)


    app.use('/auth-doctor',authDoctorcontroller)
    app.use('/doctor',doctorcontroller)


    app.use('/auth-user',authUsercontroller)
    app.use('/user',usercontroller)




    app.use(globalhandelrMW)
}


export default routerhandellar
import Joi from "joi";
import {bloodtype}from '../constants/constants.js'
import { DateTime } from "luxon";

export const updateprofiledataSchema={
    body:Joi.object({
        patientName:Joi.string()
        .optional()
        .messages({
            
            "string.base":"username must be a string"
        }),
        newemail:Joi.string()
        .email({tlds:{allow:['com']}})
        .optional()
        .messages({
            
        }),
        phone:Joi.string()
        .optional()
        .messages({

        }),
        DOB:Joi.date()
        .optional().
        messages({
            "date.base":"DOB must be a date",
            "date.strict":"DOB must be a date"
        }),
        bloodtype:Joi.string()
        .optional()
        .valid(...Object.values(bloodtype))
        .messages({
            "any.only": "Invalid blood type, must be one of: " + Object.values(bloodtype).join(', ')
        })


    })
}


export const updatepasswordSchema={
    body:Joi.object({
        oldpassword:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages({
            "string.pattern.base":"password must be contain 8 characters at least and contain uppercase and louercace "
        }),
        newpassword:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
        .messages({
            "string.pattern.base":"password must be contain 8 characters at least and contain uppercase and louercace "
        }),
        confirmpassword:Joi.string()
        .required()
        .valid(Joi.ref('newpassword'))
        .messages({
            "any.only":"new Password and confirm New Password is not match"
        }),
    })
}

export const AppointmentBookingSchema={
    body:Joi.object({

        doctor_id:Joi.string()
        .required()
        .messages({
            'any.required': 'doctor_id is required',
            'number.base': 'doctor_id must be a number'
        }),

        dateTime:Joi.string()
        .required()
        .custom((value, helpers) => {
            const dt = DateTime.fromFormat(value, 'dd-MM-yyyy hh:mm a');
            if (!dt.isValid) {
                return helpers.message('dateTime must be in the format dd-MM-yyyy hh:mm a');
            }
            return value;
        }),

        timezone:Joi.string()
        .required()
        .custom((value,helpers)=>{
            const dt=DateTime.now().setZone(value)
            if(!dt.isValid){
                return helpers.message('timezone must be a valid IANA timezone');
            }
            return value;
        })
    })
}


export const ModifyBookingDateSchema={
    body:Joi.object({

        appointmentid:Joi.string()
        .required()
        .messages({
            'any.required': 'appointmentid is required',
            'number.base': 'appointmentid must be a number'
        }),

        newDateTime:Joi.string()
        .required()
        .custom((value, helpers) => {
            const dt = DateTime.fromFormat(value, 'dd-MM-yyyy hh:mm a');
            if (!dt.isValid) {
                return helpers.message('newDateTime must be in the format dd-MM-yyyy hh:mm a');
            }
            return value;
        }),

        timezone:Joi.string()
        .required()
        .custom((value,helpers)=>{
            const dt=DateTime.now().setZone(value)
            if(!dt.isValid){
                return helpers.message('timezone must be a valid IANA timezone');
            }
            return value;
        })
    })
}


export const CancellationSchema={
    body:Joi.object({
        appointmentid:Joi.string()
        .required()
        .messages({
            'any.required': 'appointmentid is required',
            'number.base': 'appointmentid must be a number'
        })
    })
}

// export const profileImageSchema={
//     file:Joi.object({
//         originalname: Joi.string().required(),
//         mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp',).required(),
//         size: Joi.number().max(5 * 1024 * 1024).required(),
//         path: Joi.string().required()
//     })
// }


// export const profileImageSchema = Joi.object({
//     file: Joi.object({
//         originalname: Joi.string().required(),
//         mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/webp', 'image/jpg').required(),
//         size: Joi.number().max(5 * 1024 * 1024).required(),
//         path: Joi.string().required()
//     }).required()
// });


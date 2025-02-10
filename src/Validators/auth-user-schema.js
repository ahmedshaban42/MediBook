import Joi from "joi";
import {bloodtype} from '../constants/constants.js'


export const signUpSchema={
    body:Joi.object({
        patientName:Joi.string()
        .required()
        .messages({
            "any.required":"username is required",
            "string.base":"username must be a string"
        }),

        email: Joi.string()
            .email({ tlds: { allow: ['com'] } })
            .required()
            .messages({
                "string.email": "Invalid email format"
            }),

        


        DOB:Joi.date()
        .messages({
            "date.base":"DOB must be a date",
            "date.strict":"DOB must be a date"
        })
        .required(),

        gender: Joi.string()
            .valid('male', 'female')
            .required()
            .messages({
                "any.required": "Gender is required",
                "any.only": "Gender must be one of 'male', 'female'"
            }),
            password:Joi.string()
            .required()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
            .messages({
                "string.pattern.base":"password must be contain 8 characters at least and contain uppercase and louercace "
            }),

            phone:Joi.string()
            .required()
            .messages({
                "any.required": "Phone number is required"
            }),



            bloodtype: Joi.string()
            .required()
            .valid(...Object.values(bloodtype))
            .messages({
                "any.required": "Blood type is required",
                "any.only": "Invalid blood type, must be one of: " + Object.values(bloodtype).join(', ')
            })
    })
}



export const confirmEmailSchema={
    body:Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: ['com'] } })
            .required()
            .messages({
                "string.email": "Invalid email format",
                "any.required": "email is required",
            }),
            otp:Joi.string().required().messages({
                "any.required": "otp is required",
            })    
    })
}




export const resendOtpSchema={
    body:Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: ['com'] } })
            .required()
            .messages({
                "string.email": "Invalid email format",
                "any.required": "email is required",
            })  
    })
}




export const signInUserSchema={
    body:Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: ['com'] } })
            .required()
            .messages({
                "string.email": "Invalid email format",
                "any.required": "email is required",
            }),
            password:Joi.string()
            .required()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
            .messages({
                "string.pattern.base":"password must be contain 8 characters at least and contain uppercase and louercace "
            })
    })
}


export const forgetpasswordSchema={
    body:Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: ['com'] } })
            .required()
            .messages({
                "string.email": "Invalid email format",
                "any.required": "email is required",
            })  
    })
}


export const resetpasswordSchema={
    body:Joi.object({
        email: Joi.string()
            .email({ tlds: { allow: ['com'] } })
            .required()
            .messages({
                "string.email": "Invalid email format",
                "any.required": "email is required",
            }),

            otp:Joi.string().required().messages({
                "any.required": "otp is required",
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
                "any.only":"passwoed and confirm password is not match",
                "any.required": "confirmpassword is required"
            })
    })
}


export const signoutSchema={
    headers:Joi.object({
        accesstoken:Joi.required()
        .messages({
            "any.required": "accesstoken is required"
        }),
        refreshtoken:Joi.required()
        .messages({
            "any.required": "refreshtoken is required"
        }),

    }).unknown(true)
}



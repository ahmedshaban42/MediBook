import Joi from "joi"



export const signInadminSchema={
    body:Joi.object({
        email:Joi.string()
        .email({tlds:{allow:['com']}})
        .required()
        .messages(
            {
                "string.email": "Invalid email format"
            }
        ),
        password:Joi.string()
        .required()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*])[A-Za-z\d@$!%*]{8,}$/)
            .messages({
                "string.pattern.base":"password must be contain 8 characters at least and contain uppercase and louercace "
            }),
    })
}
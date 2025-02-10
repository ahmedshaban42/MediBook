import nodemailer from 'nodemailer'
import { EventEmitter } from 'node:events'

export const sendemailservice=async({to,subject,html,attachments})=>{
    try{
        const transporter=nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            auth:{
                user:process.env.USER_EMAIL,
                pass:process.env.USER_PASS,
            }
        })

        const info=await transporter.sendMail({
            from:`"no-replay" <${process.env.USER_EMAIL}>`,
            to,
            subject,
            html,
            attachments
        })


    }catch(error){
        console.log('error in send email',error)
        return error
    }
}

export const emitter=new EventEmitter;
emitter.on('sendEmail',(...args)=>{
    const {to,subject,html,attachments}=args[0]
    sendemailservice({
        to,
        subject,
        html,
        attachments
    })

})
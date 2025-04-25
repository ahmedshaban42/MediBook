import jwt from 'jsonwebtoken'
import blacklistmodel from '../DB/models/blacklist.model.js'
import adminModel from '../DB/models/admin.model.js';
import doctormodel from '../DB/models/doctors.model.js';
import patientModel from '../DB/models/patient.model.js';




export const authenticationMiddleware=()=>{
    return async(req,res,next)=>{

        const authHeader = req.headers.authorization;
        const accesstoken = authHeader && authHeader.split(' ')[1];
        //console.log(req)

            if(!accesstoken){
                return res.status(400).json({message:'plasse enter access token'})
            }
            const decodeddata=jwt.verify(accesstoken,process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN)

            const isblacklistedtoken=await blacklistmodel.findOne({where:{tokenid:decodeddata.jti}})

            if(isblacklistedtoken){
                return res.status(400).json({message:'plasse login frist'})
            }

            let user;
            if (decodeddata.role === "admin") {
                user = await adminModel.findByPk(decodeddata.id);
            } else if (decodeddata.role === "doctor") {
                user = await doctormodel.findByPk(decodeddata.id);
            } else if (decodeddata.role === "patient") {
                user = await patientModel.findByPk(decodeddata.id);
            } else {
                return res.status(401).json({ message: "invalid role in token" });
            }

            req.loggedinuser=user
            //req.loggedinuser.token={tokenid:decodeddata.jti,expirydata:decodeddata.exp}
            req.userToken={tokenid:decodeddata.jti,expirydata:decodeddata.exp}
            next()
        
    }
}

export const authorizationMiddleware=(allowroles)=>{
    return async(req,res,next)=>{
        const {role}=req.loggedinuser
        const isrloeallowed=allowroles.includes(role)
        if(!isrloeallowed){
            return res.status(409).json({message:'unauthorized'})
        }
        console.log('authorizationMiddleware')
        next()
        
    }
}

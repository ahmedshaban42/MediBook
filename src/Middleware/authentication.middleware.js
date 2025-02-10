import jwt from 'jsonwebtoken'
import blacklistmodel from '../DB/models/blacklist.model.js'




export const authenticationMiddleware=(modelName)=>{
    return async(req,res,next)=>{

            const {accesstoken}=req.headers
            if(!accesstoken){
                return res.status(400).json({message:'plasse enter access token'})
            }
            const decodeddata=jwt.verify(accesstoken,process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN)

            const isblacklistedtoken=await blacklistmodel.findOne({where:{tokenid:decodeddata.jti}})

            if(isblacklistedtoken){
                return res.status(400).json({message:'plasse login frist'})
            }

            const user=await modelName.findByPk(decodeddata.id,{
                attributes: { exclude: ['password','isVerified','otpExpiresAt','confirmotp'] }
            })
            if(!user){
                return res.status(400).json({message:'user not found plase signUp'})
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
            next()
        
    }
}

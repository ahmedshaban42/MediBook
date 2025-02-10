import doctormodel from '../../../../DB/models/doctors.model.js'
import { compareSync, hashSync } from "bcrypt"
import {generateToken,verifyToken}from '../../../../utils/token.utils.js'
import blacklistmodel from '../../../../DB/models/blacklist.model.js'
import {v4 as uuidv4}from 'uuid'


export const signInDoctor=async(req,res)=>{
    const {email,password}=req.body
    const doctor=await doctormodel.findOne({email,isVerified:true})
    if(!doctor){
        return res.status(400).json({message:'email or password not valid'})
    }

    const ispassword=compareSync(password,doctor.password)
    if(!ispassword){
        return res.status(400).json({message:'email or password not valid'})
    }
    const accesstoken=generateToken({
        data:{id:doctor.id,role:doctor.role},
        sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,
        Options:{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })

    const refreshtoken=generateToken({
        data:{id:doctor.id,role:doctor.role},
        sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN,
        Options:{expiresIn:process.env.JWT_REFRESH_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })
    res.status(200).json({message:'login susseccfully',accesstoken,refreshtoken})


}

export const signoutDoctor=async(req,res)=>{
    const {accesstoken,refreshtoken}=req.headers
    const verifyaccesstoken=verifyToken({data:accesstoken,sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN})
    const verifyrefreshtoken=verifyToken({data:refreshtoken,sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN})

    const [isAccessTokenBlacklisted, isRefreshTokenBlacklisted] = await Promise.all([
        blacklistmodel.findOne({ where: { tokenid: verifyaccesstoken.jti } }),
        blacklistmodel.findOne({ where: { tokenid: verifyrefreshtoken.jti } })
    ]);

    if(isAccessTokenBlacklisted&&isRefreshTokenBlacklisted){
        return res.status(200).json({message:'already logout'})
    }
    await blacklistmodel.bulkCreate([
        {
            tokenid:verifyaccesstoken.jti,
            expirydata:verifyaccesstoken.exp
        }
        ,
        {
            tokenid:verifyrefreshtoken.jti,
            expirydata:verifyrefreshtoken.exp
        }])
        res.status(200).json({message:'logout susseccfully'})

}
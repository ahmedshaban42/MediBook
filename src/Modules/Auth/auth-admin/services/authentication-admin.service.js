import blacklistmodel from "../../../../DB/models/blacklist.model.js";
import adminModel from "../../../../DB/models/admin.model.js";
import { generateToken,verifyToken } from "../../../../utils/token.utils.js";
import {v4 as uuidv4}from 'uuid'
import { where } from "sequelize";


export const signInadmin=async(req,res)=>{
    const{email,password}=req.body
    const admin=await adminModel.findOne({where:{email}})
    if(!admin){
        return res.status(400).json({message:'email or password not valid'})
    }
    if(password!==admin.password){
        return res.status(400).json({message:'email or password not valid'})
    }

    const accesstoken=generateToken({
        data:{
            id:admin.id,
            role:admin.role
        },
        sk:process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,
        Options:{expiresIn:process.env.JWT_ACCESS_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })

    const refreshtoken=generateToken({
        data:{
            id:admin.id,
            role:admin.role
        },
        sk:process.env.JWT_REFRESH_TOKEN_SECRETKEY_LOGIN,
        Options:{expiresIn:process.env.JWT_REFRESH_TOKEN_EXP_LOGIN,jwtid:uuidv4()}
    })
    res.status(200).json({message:'login susseccfully',accesstoken,refreshtoken})


}


export const signoutadmin=async(req,res)=>{
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
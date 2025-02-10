
import jwt from 'jsonwebtoken'



export const generateToken=({data,sk=process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN,Options})=>{
    return jwt.sign(data,sk,Options)
}

export const verifyToken=({data,sk=process.env.JWT_ACCESS_TOKEN_SECRETKEY_LOGIN})=>{
    return jwt.verify(data,sk)
}
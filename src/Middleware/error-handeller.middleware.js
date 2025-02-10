export const errorHandler=(api)=>{
    return async(req,res,next)=>{
        api(req,res,next).catch((error)=>{
            console.log(`Error in ${req.url} from error handeler middleWare`,error)
            return next(new Error(error.message,{cause:500}))
        })
    }
}

export const globalhandelrMW= (error,req,res,next)=>{
    console.log(`global error handelr ${error.message}`)
    return res.status(500).json({message:'somthing went wrong',error:error.message})
}

export const validationMW=(Schema)=>{
    return async (req,res,next)=>{
        const Schemakey=Object.keys(Schema)
        let validationerror=[]

        for(const key of Schemakey){
            const {error}=Schema[key].validate(req[key],{abortEarly:false})
            if(error){
                validationerror.push(...error.details.map(err => err.message)); 
            }
        }
        
        if(validationerror.length){
            return res.status(400).json({message:'validation error',error:validationerror})
        }
        next()
    }
}
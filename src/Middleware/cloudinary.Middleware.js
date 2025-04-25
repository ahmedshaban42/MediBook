import multer from 'multer'
import fs from 'fs'



export const MulterCloud=(allowExtentionns=[])=>{
    const storage=multer.diskStorage({})

    const fileFilter=(req,file,cb)=>{
        if(allowExtentionns.includes(file.mimetype)){
            cb(null,true)
        }else{
            cb(new Error('invalid file type',false))
        }
    }


    const upload=multer({fileFilter,storage})
    return upload
}
import doctormodel from "../../../DB/models/doctors.model.js"
import patientModel from "../../../DB/models/patient.model.js"
import ratingModel from "../../../DB/models/ratings.model.js"
import {col, fn,}from 'sequelize'




export const addRatind=async(req,res)=>{
    const {id:patient_id}=req.loggedinuser
    const {doctor_id}=req.params
    const {rating,comment}=req.body

    const doctor=await doctormodel.findByPk(doctor_id)
    if(!doctor){
        return res.status(400).json({message:"doctor not found"})
    }

    const israting=await ratingModel.findAll({where:{patient_id,doctor_id}})
    if(israting.length>0){
        return res.status(400).json({message:"You have already rated this doctor"})
    }

    await ratingModel.create({patient_id,doctor_id,rating,comment})
    const result=await ratingModel.findOne(
        {
            where:{doctor_id},
            attributes:[ [ fn('AVG', col('rating') ),'avg' ] ]
        }
    )
    const avg=parseFloat(result.dataValues.avg || 0)
    
    await doctormodel.update({averageRating:avg},{where:{id:doctor_id}})
    return res.status(201).json({ message: "Rating added successfully.", })
}



export const getDoctorRating=async(req,res)=>{
    const {doctorid}=req.params
    const doctor=await doctormodel.findByPk(doctorid)
    if(!doctor){
        return res.status(400).json({message:"doctor not found"})
    }

    const rating=await ratingModel.findAll({where:{doctor_id:doctorid}})
    if(rating.length===0){
        return res.status(400).json({message:"This doctor has no ratings yet"})
    }
    return res.status(201).json({ message: "Doctor ratings retrieved successfully",rating })
}


export const getAllRatings=async(req,res)=>{
    const rating=await ratingModel.findAll(
        {
            include:[
                {
                    model:patientModel,
                    as:'patientData',
                    attributes:['id','patientName']
                },
                {
                    model:doctormodel,
                    as:'doctorData',
                    attributes:['id','doctorName']
                }
            ],
            attributes:['id','rating','comment']
        }
    )
    return res.status(200).json({message:'rating is',rating})
}

export const deleteRating=async(req,res)=>{
    const {id:Adminid}=req.loggedinuser
    const {ratingid}=req.params
    const rating=await ratingModel.findByPk(ratingid)
    if(!rating){
        return res.status(404).json({message:'can not find rating'})
    }
    const doctorid=rating.doctor_id
    await ratingModel.destroy({where:{id:ratingid}})

    const result=await ratingModel.findOne(
        {
            where:{doctor_id:doctorid},
            attributes:[[fn('AVG',col('rating')),'avg']]
        }
    )
    const avg=parseFloat(result.dataValues.avg || 0)
    await doctormodel.update({averageRating:avg},{where:{id:doctorid}})
    return res.status(200).json({message:'delete rating succcessfully'})
}
import { DataTypes,Model } from "sequelize";
import { sequelizeconfig } from "../conection.js";
import doctormodel from "./doctors.model.js";
import patientModel from "./patient.model.js";



class ratingModel extends Model{}
ratingModel.init({
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    rating:{
        type:DataTypes.INTEGER,
        allowNull:true,
        validate:{
            min:1,
            max:5
        }
    },
    comment:{
        type:DataTypes.TEXT,
        allowNull:true,
    },

},
{
    sequelize:sequelizeconfig,
    timestamps:true,
    tableName:'tbl_ratings',
    freezeTableName:true
}
)
export default ratingModel


doctormodel.hasMany(ratingModel,{
    foreignKey:"doctor_id",
    as:"ratingDoctorData",
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
})
ratingModel.belongsTo(doctormodel,{
    foreignKey:'doctor_id',
    as:"doctorData"
})


patientModel.hasMany(ratingModel,{
    foreignKey:'patient_id',
    as:'ratingPatientData',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
})

ratingModel.belongsTo(patientModel,{
    foreignKey:"patient_id",
    as:"patientData"
})
import { DataTypes,Model } from "sequelize";
import {sequelizeconfig} from '../conection.js'



class doctormodel extends Model{}
doctormodel.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    doctorName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: true,
            is: /^[a-zA-Z\s]+$/i, 
        },
    },
    email:{
        type: DataTypes.STRING,
        unique: 'idx_email_doctor_unique',
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    phone:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    specialization:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    experienceYears:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate: {
            min: 0,
            max: 50,
        }
    },
    DOB: {
        type: DataTypes.DATE,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'), 
        allowNull: false
    },
    confirmotp:{
        type:DataTypes.STRING,
        allowNull:true
    },
    otpExpiresAt:{
        type:DataTypes.DATE,
        allowNull:true
    },
    isVerified:{
        type:DataTypes.STRING,
        defaultValue:false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'doctor'
    }
},{
    sequelize:sequelizeconfig,
    tableName:'tbl_doctors',
    timestamps:true,
    freezeTableName:true
})

export default doctormodel
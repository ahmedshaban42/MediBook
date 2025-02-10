import { DataTypes,Model } from "sequelize";
import {sequelizeconfig} from '../conection.js'




class adminModel extends Model{}
adminModel.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    adminName:{
        type:DataTypes.STRING,
        allowNull:false,
        validate: {
            notEmpty: true,
            is: /^[a-zA-Z\s]+$/i, 
        },
    },
    email:{
        type: DataTypes.STRING,
        unique: 'idx_email_unique',
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
        validate: {
            is: /^\+?\d{10,15}$/, 
        }
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
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'admin'
    }
},{
    sequelize:sequelizeconfig,
    tableName:'tbl_admins',
    timestamps:true,
    freezeTableName:true
})

export default adminModel
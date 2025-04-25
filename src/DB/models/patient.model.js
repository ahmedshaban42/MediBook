import { DataTypes,Model } from "sequelize";
import {sequelizeconfig} from '../conection.js'
import { bloodtype } from "../../constants/constants.js";


class patientModel extends Model{}
patientModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    patientName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: 'idx_email_patient_unique',
        allowNull: false,
        validate: {
            isEmail: true,
        }
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'patient'
    },
    password: {
        type: DataTypes.STRING, 
        allowNull: false,
        validate: {
            checkPasswordLength(value) {
                if (value.length <= 6) {
                    throw new Error('Password must be longer than 6 characters');
                }
            }
        }
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    DOB: {
        type: DataTypes.DATE,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'), 
        allowNull: false
    },
    bloodtype: {
        type: DataTypes.ENUM(...Object.values(bloodtype)),
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
    profileImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    profileImagePublicId: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    coverImageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    },
    coverImagePublicId: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null
    }

},{
    sequelize:sequelizeconfig,
    modelName:'tbl_patients',
    timestamps:true,
    freezeTableName:true,

})
export default patientModel

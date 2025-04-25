import { Sequelize } from "sequelize";
import { DataTypes,Model } from "sequelize";
import { sequelizeconfig } from "../conection.js";
import { fileTypes } from "../../constants/constants.js";
import appointmentModel from "./appointment.model.js";


class appointmentFileModel extends Model{}

appointmentFileModel.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        fileurl:{
            type:DataTypes.STRING,
            allowNull:false
        },
        filePublicId:{
            type:DataTypes.STRING,
            allowNull:false
        },
        fileType:{
            type:DataTypes.ENUM(...Object.values(fileTypes)),
            allowNull:false,
            defaultValue:fileTypes.OTHER
        },
        fileName:{
            type:DataTypes.STRING,
            allowNull:false
        }
    },
    {
        sequelize:sequelizeconfig,
        timestamps:true,
        tableName:'tbl_appointmentFile',
        freezeTableName:true 
    })

    export default appointmentFileModel


    appointmentModel.hasMany(appointmentFileModel,{
        foreignKey:'appointmentId',
        as:'appointmentFileData',
        onDelete:'CASCADE',
        onUpdate:'CASCADE',
    })

    appointmentFileModel.belongsTo(appointmentModel,{
        foreignKey:'appointmentId',
        as:'appointmentData'
    })
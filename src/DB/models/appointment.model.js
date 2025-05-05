import { DataTypes,Model } from "sequelize";
import {sequelizeconfig} from '../conection.js'
import { appointmentStatus } from "../../constants/constants.js";

import patientModel from "./patient.model.js";
import doctormodel from "./doctors.model.js";
import adminModel from "./admin.model.js";
import { AppointmentType } from "../../constants/constants.js";


class appointmentModel extends Model{}
appointmentModel.init({
    id:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    appointmentStatus: {
        type: DataTypes.ENUM(...Object.values(appointmentStatus)), 
        allowNull: false,
        defaultValue:appointmentStatus.PENDING 
    },
    dateTime:{
        type:DataTypes.DATE,
        allowNull:false
    },
    appointmenttype:{
        type:DataTypes.ENUM(...Object.values(AppointmentType)),
        defaultValue:AppointmentType.IN_PERSON,
        allowNull:false,
    },
    zoomLink:{
        type:DataTypes.STRING,
        allowNull:true
    }
},{
    sequelize:sequelizeconfig,
    tableName:'tbl_appointments',
    timestamps:true,
    freezeTableName:true
})

export default appointmentModel

//patient
patientModel.hasMany(appointmentModel,{
    foreignKey :'patient_id',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
    as:'appointmentData'
})
appointmentModel.belongsTo(patientModel,{
    foreignKey:'patient_id',
    as:'patientData'
})

//doctor
doctormodel.hasMany(appointmentModel,{
    foreignKey:'doctor_id',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
    as:'appointmentData'
})
appointmentModel.belongsTo(doctormodel,{
    foreignKey:'doctor_id',
    as:'doctorData'
})

//admin
adminModel.hasMany(appointmentModel,{
    foreignKey:'admin_id',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
    as:'appointmentData'
})
appointmentModel.belongsTo(adminModel,{
    foreignKey:'admin_id',
    as:'adminData'
})

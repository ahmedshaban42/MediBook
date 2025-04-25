import { DataTypes,Model } from "sequelize";
import { sequelizeconfig } from "../conection.js";
import patientModel from "./patient.model.js";
import doctormodel from "./doctors.model.js";
import appointmentModel from "./appointment.model.js";

class MedicalHistoryModel extends Model{}
MedicalHistoryModel.init(
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true
        },
        notes:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        diagnosis:{
            type:DataTypes.TEXT,
            allowNull:false
        },
        medications:{
            type:DataTypes.JSON,
            allowNull:true,
        },
        requestedTests:{
            type:DataTypes.JSON,
            allowNull:true,
            
        },
    },
    {
        sequelize:sequelizeconfig,
        tableName:"tbl_MedicalHistory",
        timestamps:true,
        freezeTableName:true
    }
)
export default MedicalHistoryModel

//patient
patientModel.hasMany(MedicalHistoryModel,{
    foreignKey:'patient_id',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
    as:'MedicalHistoryPatientData'
})

MedicalHistoryModel.belongsTo(patientModel,{
    foreignKey:'patient_id',
    as:'patientData'
})

//doctor
doctormodel.hasMany(MedicalHistoryModel,{
    foreignKey:'doctor_id',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
    as:'MedicalHistoryDoctorData'
})

MedicalHistoryModel.belongsTo(doctormodel,{
    foreignKey:'doctor_id',
    as:'doctorData'
})

//appointment
appointmentModel.hasOne(MedicalHistoryModel,{
    foreignKey:'appointment_id',
    onDelete:'CASCADE',
    onUpdate:'CASCADE',
    as:'MedicalHistoryAppointmentData'
})

MedicalHistoryModel.belongsTo(appointmentModel,{
    foreignKey:'appointment_id',
    as:'appointmentData'
})


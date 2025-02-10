import { DataTypes,Model } from "sequelize";
import {sequelizeconfig} from '../conection.js'


class blacklistmodel extends Model{}
blacklistmodel.init({
    tokenid:{
        type:DataTypes.STRING,
        allowNull:false
    },
    expirydata:{
        type:DataTypes.STRING,
        allowNull:false
    }
},
    {
        sequelize:sequelizeconfig,
        timestamps:true,
        modelName:'tbl_blacklist',
        freezeTableName:true,
    })

    export default blacklistmodel
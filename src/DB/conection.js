import { Sequelize } from "sequelize";
export const sequelizeconfig=new Sequelize('hospital','root','',{
    host:'localhost',
    dialect:'mysql',
    // logging:(mes)=>console.log('query is',mes)
})

export const connection=async()=>{
    try{
        await sequelizeconfig.sync({alter:true,force:false});
        console.log('doooooooone')
    }catch(error){
        console.log('big errrror',error)
    }
    

}

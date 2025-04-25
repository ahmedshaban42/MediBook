import { Sequelize } from "sequelize";
export const sequelizeconfig=new Sequelize('hospital','root','',{
    host:'localhost',
    dialect:'mysql',
    // logging:(mes)=>console.log('query is',mes)
})

// export const sequelizeconfig = new Sequelize('sql8772777', 'sql8772777', 'bTXFXqyDIu', {
//     host: 'sql8.freesqldatabase.com',
//     dialect: 'mysql',
//     port: 3306,
//     logging: false, 
// });

export const connection=async()=>{
    try{
        await sequelizeconfig.sync({alter:true,force:false});
        console.log('doooooooone')
    }catch(error){
        console.log('big errrror',error)
    }
    

}

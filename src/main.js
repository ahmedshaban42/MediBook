import express from 'express'
import { connection } from './DB/conection.js'

import path from 'path'
import { config } from 'dotenv'
config({path:path.resolve(`src/config/.${process.env.NODE_ENV}.env`)})
console.log(path.resolve(`src/config/.${process.env.NODE_ENV}.env`))

import routerhandellar from './utils/router-handrller.utils.js'


const bootstrab=()=>{
    const app=express()
    const port=process.env.PORT

    connection()

    app.use(express.json())

    routerhandellar(app)



    app.listen(process.env.PORT,()=>{
        console.log(`server work in port ${port} successfuly` )
    })
}
export default bootstrab
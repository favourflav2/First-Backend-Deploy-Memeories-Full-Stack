import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import cors from 'cors'
import morgan from 'morgan'
import UserRoutes from './routes/userRoutes.js'
import TourRoutes from './routes/tourRoutes.js'


const app = express()

// Middleware
dotenv.config()
app.use(express.json({limit: "30mb", extended: true}))
app.use(express.urlencoded({limit: "30mb", extended: true}))
app.use(cors())
app.use(morgan("dev"))

const port = process.env.PORT || 5001
console.log(process.env.MONGO_URL)
// MongooseDb
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(port, ()=>{
        console.log(`Listening running on port ${port}`)
    })
}).catch((e)=>{
    console.log(e.message)
})
app.get('/',(req,res)=>{
    res.send("hello")
})

// Routes
app.use('/auth',UserRoutes)
app.use('/tour',TourRoutes)

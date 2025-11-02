import mongoose from "mongoose"
import {ENV} from "./env.js"

export const connectDB = async()=>{
    if(!ENV.DB_URL){
        throw new Error("DB_URL is not defined in environment variables")
    }
    try {
        const conn = await mongoose.connect(ENV.DB_URL)
        console.log("connected to mongoDB:",conn.connection.host);
    } catch (error) {
        console.log("error connecting to MongoDB",error);
        process.exit(1)
    }
}
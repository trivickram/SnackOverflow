import dotenv from 'dotenv';
import mongoose from "mongoose";
import { DB_NAME } from '../constants.js'

dotenv.config();

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`\n MongoDB connected. DB host: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.error("DB connection Error: ", error);
        process.exit(1);
    }
}

export default connectDB;
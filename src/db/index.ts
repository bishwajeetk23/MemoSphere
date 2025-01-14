import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "../constant";

const connectDB = async()=>{
    try {
        const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB: ${connectionInstance.connection.host}`);    
    } catch (error) {
        console.log(`${MONGODB_URI}/${DB_NAME}`);
        console.log("MONGODB connection error: ",error);
        process.exit(1);
    }
};

export default connectDB;
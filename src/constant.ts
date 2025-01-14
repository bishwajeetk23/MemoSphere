// TODO: seperate dynamic(env dependent config file) and static(hard coded values) variable files 
import * as dotenv from 'dotenv';
dotenv.config();
export const DB_NAME = "MEMOSPHERE";
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI
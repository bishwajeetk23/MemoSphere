import express from "express";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const port : string = process.env.PORT || '3000';
app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}/`);
    
});
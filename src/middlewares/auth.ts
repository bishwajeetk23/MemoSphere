import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constant";
export function auth(req:Request,res:Response,next:NextFunction){
   const header = req.headers["authorization"];
   const SECRET = JWT_SECRET;
   if(!SECRET){
        throw new Error('JWT_SECRET is not defined in the environment variables');
    }
   const decoded = jwt.verify(header as string,SECRET);
   if(decoded){
        // TODO: write the logic of ts-ignore
        //@ts-ignore
        req.userId = decoded.id;
        next();
   }else{
    res.status(403).json({
        message: "You are not logged in"
    });
   }
}
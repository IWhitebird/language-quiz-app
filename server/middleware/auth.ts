import { Request , Response , NextFunction } from "express";
import { AuthReq } from "../types";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

export async function auth(req : AuthReq , res : Response , next : NextFunction) {
    try{
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "No token, authorization denied",
            });
        }
        
        try{

            const decode = jwt.verify(token, process.env.JWT_SECRET!);
            req.user = decode;
            next();
        }
        catch(error){
            return res.status(401).json({
                success: false,
                message: "Token is not valid",
            });
        }

    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Middleware Error",
        });
    }
}

export async function isAdmin(req : AuthReq , res : Response , next : NextFunction) {
    try{
        if(req.user.accountType !== "admin"){
            return res.status(401).json({
                success: false,
                message: "Not an admin",
            });
        }
        next();
    }
    catch(error){
        res.status(500).json({
            success: false,
            message: "Middleware Error |Admin|",
        });
    }
}

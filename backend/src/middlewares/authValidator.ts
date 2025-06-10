import { NextFunction, Request, Response } from "express"
import UserModel from "../models/userModel.ts"
import { verifyToken } from "../services/userServices.ts"



export const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const token = req.cookies.accesstoken
        console.log("Token: ", token)
        if(!token){
            res.status(401).json({ success: false, message: "Unauthorized to access" });
            return;
        }    
    
        const decoded = verifyToken(token)
        const user = await UserModel.findById(decoded)
        if(!user) {
            res.status(401).json({ success: false, message: "Unauthorized to access" });
            return;
        }
        req.user = {
            _id: user._id,
            email: user.email,
            name: user.name
        };
        next()
    } catch (error) {
        res.status(402).json({ success: false, message: "Unauthorized to access" });
        return;
    }
}



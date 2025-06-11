import { NextFunction, Request, Response } from "express"
import UserModel from "../models/userModel.js"
import { verifyToken } from "../services/userServices.js"
import { HttpError, UnauthorizedError } from "../utils/errors.js"


export const authMiddleware = async (req: Request, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const token = req.cookies.accesstoken
        
        if(!token){
            throw new UnauthorizedError("Unauthorized to access: No token provided");
        }    
    
        const decoded = verifyToken(token)
        const user = await UserModel.findById(decoded)
        
        if(!user) {
            throw new UnauthorizedError("Unauthorized to access: User not found");
        }
        
        req.user = {
            _id: user._id,
            email: user.email,
            name: user.name
        };
        
        next()
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        } else {
            res.status(401).json({ success: false, message: "Unauthorized to access" });
        }
    }
}



import { Request, Response } from "express"
import { loginUser, registerUser } from "../services/userServices.ts"
import jwt from "jsonwebtoken";


export const  register = async (req: Request, res: Response)  : Promise<void>=> {
    try {
        const { name, password, email } = req.body
        registerUser(name, password, email, req, res);
    }catch(error){
        res.status(500).json({ success: false, message: "Something went wrong."})
    }
    
}

export const login = async(req: Request, res: Response)  : Promise<void>=> {
    try {
        const { password, email } = req.body
        loginUser(password, email, req, res);
    }catch(error){
        res.status(500).json({ success: false, message: "Something went wrong."})
    }
}



export const validate = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.accesstoken;

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided." });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    res.status(200).json({ message: "Authenticated", user: decoded });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid or expired token.", error
     });
  }
};

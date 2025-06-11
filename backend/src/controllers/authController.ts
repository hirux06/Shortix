import { Request, Response } from "express"
import { cookieOptions, loginUser, registerUser, signIn } from "../services/userServices.js"
import jwt from "jsonwebtoken";
import { HttpError, NotFoundError, UnauthorizedError } from "../utils/errors.js";
import UserModel from "../models/userModel.js";


export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, password, email } = req.body;
        const user = await registerUser(name, password, email);
        
        const token = signIn(user._id);
        res.cookie("accesstoken", token, cookieOptions);
        
        res.status(201).json({ success: true, message: "User Successfully registered", token });
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Something went wrong." });
        }
    }
}

export const login = async(req: Request, res: Response): Promise<void> => {
    try {
        const { password, email } = req.body;
        const user = await loginUser(password, email);
        
        const token = signIn(user._id);
        res.cookie("accesstoken", token, cookieOptions);
        
        res.status(200).json({ success: true, message: "User Login Successful", token });
    } catch (error) {
        if (error instanceof HttpError) {
            res.status(error.statusCode).json({ success: false, message: error.message });
        } else {
            res.status(500).json({ success: false, message: "Something went wrong." });
        }
    }
}

export const validate = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.cookies?.accesstoken;

    if (!token) {
      throw new UnauthorizedError("No token provided.");
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    const user = await UserModel.findById(decoded.id).select('-password -__v');
    
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    res.status(200).json({ message: "Authenticated", user });
  } catch (error) {
    if (error instanceof HttpError) {
      res.status(error.statusCode).json({ message: error.message });
    } else {
      res.status(401).json({ message: "Unauthorized: Invalid or expired token." });
    }
  }
};

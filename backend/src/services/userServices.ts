import jsonwebtoken from "jsonwebtoken"
import UserModel from "../models/userModel.ts"
import bcryptjs from "bcryptjs"
import { CookieOptions } from 'express';
import mongoose from "mongoose";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../utils/errors.js";


export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 1000*60*5
}


export const registerUser = async(name: string, password: string, email: string) => {
   try {
    const isUserExisting = await UserModel.findOne({ email });

    if(isUserExisting) {
        throw new BadRequestError("User already exists. Kindly login");
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    const user = new UserModel({
        name,
        password: hashedPassword,
        email
    })

    await user.save()
    
    return user;
   } catch (error) {
    if (error instanceof BadRequestError) {
        throw error;
    }
    throw new Error(`Registration failed: ${error.message}`);
   }
}


export const loginUser = async(password: string, email: string) => {
    if(!(email || password)) {
        throw new BadRequestError("Email or Password is required to login");
    }

    const isUserExisting = await UserModel.findOne({ email });
    
    if(!isUserExisting){
        throw new NotFoundError("User is not found. Kindly register");
    }

    const isPasswordValid = await bcryptjs.compare(password, isUserExisting.password);
    
    if(!isPasswordValid) {
        throw new UnauthorizedError("Password is invalid. Kindly reenter correct password");
    }

    return isUserExisting;
}


export const signIn = (id : mongoose.Types.ObjectId) : string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }
    
    return jsonwebtoken.sign({ id: id }, jwtSecret, { expiresIn: '1d' });
}

export const verifyToken = (token: string) : string => {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jsonwebtoken.verify(token, jwtSecret) as { id: string };
    return decoded.id;
}
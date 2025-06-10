import jsonwebtoken from "jsonwebtoken"
import UserModel from "../models/userModel.ts"
import { Request, Response } from "express";
import bcryptjs from "bcryptjs"
import { CookieOptions } from 'express';
import mongoose from "mongoose";


export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000*60*5
}


export const registerUser = async(name: string, password: string, email: string, req: Request, res: Response) => {
   try {
    const isUserExisting = await UserModel.find({ email });

    if(isUserExisting.length > 0) {
        res.status(400).json({ success: false, message: "User already exists. Kindly login"})
        return;
    }

    const hashedPassword = await bcryptjs.hash(password, 10)

    const user = new UserModel({
        name,
        password: hashedPassword,
        email
    })

    await user.save()

    const token = signIn(user._id, req, res)
    
    res.status(201).send({ success: true, message: "User Successfully registered", token})
   } catch (error) {
    res.status(500).send({ success: false, message: "Internal server error ",error: error})
   }

}


export const loginUser = async(password: string, email: string, req: Request, res: Response) => {
    try{
        if(!(email || password)) {
            res.status(400).json({ success: false, message: "Email or Password is required to login" });
            return;
        }

        const isUserExisting = await UserModel.findOne({ email })
        console.log(isUserExisting)
        if(!isUserExisting){
            res.status(404).json({ success: false, message: "User is not found. Kindly register" });
            return;
        }

        const isPasswordValid = await bcryptjs.compare(password, isUserExisting.password)
        console.log(isPasswordValid)
        if(!isPasswordValid) {
            res.status(401).json({ success: false, message: "Password is invalid. Kindly reenter correct password" });
            return;
        }

        const token = signIn(isUserExisting._id, req, res)
        res.status(200).send({ success: true, message: "User Login Successful", token})

    }catch (error) {
    res.status(500).send({ success: false, message: "Internal server error ",error: error})
   }

}


export const signIn = (id : mongoose.Types.ObjectId, req: Request, res: Response) : string => {
    const jwtSecret = process.env.JWT_SECRET 

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }
    const token = jsonwebtoken.sign({ id: id }, jwtSecret, { expiresIn: '1d' })
    res.cookie("accesstoken", token, cookieOptions)
    return token
}

export const verifyToken = (token: string) : string => {
    const jwtSecret = process.env.JWT_SECRET 

    if (!jwtSecret) {
        throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jsonwebtoken.verify(token, jwtSecret) as { id: string }
    return decoded.id
}
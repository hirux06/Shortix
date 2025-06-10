import { Request, Response } from "express"
import { loginUser, registerUser } from "../services/userServices.ts"

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

// export const logout: boolean() => {
//     return true
// }

// export const getCurrUser: boolean() => {
//     return true
// }
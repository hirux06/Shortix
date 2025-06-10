import express from "express"
import { login, register, validate } from "../controllers/authController.ts"


const authRouter = express.Router()

authRouter.post("/register", register)
authRouter.post("/login", login)
authRouter.get("/validate", validate)
// authRouter.post("/logout", logout)
// authRouter.get("/me", authMiddleware,getCurrUser)

export default authRouter
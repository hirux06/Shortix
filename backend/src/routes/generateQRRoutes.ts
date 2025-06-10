import { Router } from "express";
import { convertURLToQR } from "../controllers/qrcodeController.ts";

const generateQRRoutes = Router();

generateQRRoutes.post("/", convertURLToQR)

export default generateQRRoutes
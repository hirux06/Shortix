import { Router } from "express";
import { getAllLinksByUserId } from "../controllers/statsContoller.js";

const statsRoutes = Router();

statsRoutes.post("/", getAllLinksByUserId)

export default statsRoutes
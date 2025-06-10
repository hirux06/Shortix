import { Router } from "express";
import {shortenUrl} from "../controllers/shortenController.js";

const shortenUrlRoute = Router();

shortenUrlRoute.post("/", shortenUrl)

export default shortenUrlRoute
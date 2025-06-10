import { Request, Response } from "express";
import UrlModel from "../models/urlModel.js";
import redisClient from "../utils/redisClient.js";
import { SHORT_URL_PREFIX } from "../services/generateShortId.js";

export const redirectUrl = async (req: Request<{url: string}>, res: Response) : Promise<void> => {
  try {
    const url = req.params.url;

    const redisKey = `${SHORT_URL_PREFIX}${url}`;
    const cachedFullUrl = await redisClient.get(redisKey);

    if (cachedFullUrl) {
      UrlModel.updateOne({ shortUrl: url }, { $inc: { clicks: 1 } }).catch(console.error);
      console.log("CAche HATTT")
      res.redirect(cachedFullUrl);
      return;
    }
    
    const updatedDoc = await UrlModel.findOneAndUpdate({ shortUrl: url }, { $inc: { clicks: 1 } }, { new: true });
    if (!updatedDoc) {
      res.status(404).json({ success: false, message: "Page not found for the specified URL"});
      return;
    } 
    const fullUrl = updatedDoc.fullUrl;
    res.redirect(fullUrl);
  } catch (error: unknown) {
    res.status(500).json({ success: false, message: "Internal Server Error" })
  }
};

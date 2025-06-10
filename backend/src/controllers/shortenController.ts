import { Request, Response } from "express";
import UrlModel from "../models/urlModel.js";
import { generateShortId, hashLongUrl, LONG_URL_PREFIX, SHORT_URL_PREFIX } from "../services/generateShortId.js";
import redisClient from "../utils/redisClient.js";

export const shortenUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const { url, slug } = req.body;

    // Redis Caching Part

    const longUrlHash = hashLongUrl(url);
    const existingShortUrl = await redisClient.get(`${LONG_URL_PREFIX}${longUrlHash}`);
    if(existingShortUrl) {
      console.log("Cache Hit::")
      res.status(200).json({ success: true, shortUrl: process.env.APP_URL + existingShortUrl });
      return;
    }

    // Slug checking part

    if(slug){
      const isSlugExists = await UrlModel.findOne({ shortUrl: slug })
        if (isSlugExists) {
          res.status(400).json({ success: false, message: "Custom alias / slug already taken" });
          return;
        }
    }

    // Already present case

    const isFound = await UrlModel.findOne({ fullUrl : url })

    if(isFound) {
      res.status(200).json({ success: true, shortUrl: process.env.APP_URL + isFound.shortUrl });
      return;
    }
    
    // Generating short url

    const shortUrl = slug || generateShortId();

    // Saving newUrl to the DB

    const newUrl = new UrlModel({
      fullUrl: url,
      shortUrl: shortUrl,
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000) 
    });

    // Adding the reference id of the user, creating it

    if(req.user) {
      newUrl.user = req.user._id
    }

    // Saving URL data into the db

    await newUrl.save();

    // Store both the mappings
    console.log("Cache NOO Hit::")
    await redisClient.set(`${SHORT_URL_PREFIX}${shortUrl}`, url , { EX: 60 * 60 * 24 });
    await redisClient.set(`${LONG_URL_PREFIX}${longUrlHash}`, shortUrl , { EX: 60 * 60 * 24 });

    res.status(201).json({ success: true, shortUrl: process.env.APP_URL + shortUrl });
  } catch (error) {
    console.error("Error shortening URL:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

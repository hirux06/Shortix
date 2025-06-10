import { NextFunction, Request, Response } from "express"
import validator from 'validator';

export const validateLongUrlMiddleware = (req: Request, res: Response, next: NextFunction)  => {
    const { url, slug = null } = req.body;

    const appUrl = process.env.APP_URL;

    if (!appUrl) {
        res.status(500).json({ success: false, message: "Server configuration error: APP_URL not set or not read properly" });
        return;
    }

    if (!url) {
        res.status(400).json({ success: false, message: "URL parameter is required" });
        return;
    }

    if (typeof url !== "string") {
        res.status(400).json({ success: false, message: "URL must be a non-empty string" });
        return;
    }

    const newUrl = url.trim()

    if (!newUrl) {
        res.status(400).json({ success: false, message: "URL cannot be empty or whitespace" });
        return;
    }

    if(newUrl.includes(appUrl)){
        res.status(400).json({ success: false, message: "Cannot create short urls for this link. Please try again with some other link"})
        return;
    }

    if(newUrl.startsWith(appUrl)){
        res.status(400).json({ success: false, message: "Cannot create short url for the same server links. Please use some other sites long urls"})
        return;
    }

    if(!validator.isURL(newUrl, { protocols: ['http', 'https'] , require_protocol: true})){
        res.status(400).json({ success: false, message: "Invalid URL format. Please include http:// or https://" });
        return;
    }

  
    
    req.body.url = newUrl

    if(slug) {

        if (typeof slug !== 'string') {
            res.status(400).json({ success: false, message: "Slug must be a string" });
            return;
        }

        const cleanSlug = slug.trim();

        if (!cleanSlug) {
            res.status(400).json({ success: false, message: "Slug cannot be empty" });
            return;
        }
        
        if (cleanSlug.length < 3 || cleanSlug.length > 30) {
            res.status(400).json({ success: false, message: "Slug must be between 3 and 30 characters" });
            return;
        }

        const reservedSlugs = ["create", "auth", "register", "login", "url"];
        if (reservedSlugs.includes(cleanSlug.toLowerCase())) {
            res.status(400).json({ success: false, message: "This slug is reserved. Please choose a different one." });
            return;
        }


        const slugRegex = /^[0-9a-zA-Z\-_.]+$/;
        if (!slugRegex.test(cleanSlug)) {
            res.status(400).json({ success: false, message: "Slug can only contain numbers, letters, hyphens (-), underscores (_), and dots (.)" });
            return;
        }


        req.body.slug = cleanSlug;
    }

    next();
}

export const validateShortUrlMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const url = req.params.url

    if (!url) {
        res.status(400).json({ success: false, message: "URL parameter is required" });
        return;
    }


    if (typeof url !== "string" || !url.trim()) {
        res.status(400).json({ success: false, message: "URL must be a non-empty string" });
        return;
    }

    next()
}


export const validateQRUrl = (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    if (!url) {
        res.status(400).json({ success: false, message: "URL parameter is required" });
        return;
    }

    if (typeof url !== "string") {
        res.status(400).json({ success: false, message: "URL must be a non-empty string" });
        return;
    }

    const newUrl = url.trim()

    if (!newUrl) {
        res.status(400).json({ success: false, message: "URL cannot be empty or whitespace" });
        return;
    }

    if(!validator.isURL(newUrl, { protocols: ['http', 'https'] , require_protocol: true})){
        res.status(400).json({ success: false, message: "Invalid URL format. Please include http:// or https://" });
        return;
    }

    req.body.url = newUrl

    next()
}
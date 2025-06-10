import { Request, Response } from "express";
import QRCode from "qrcode";
import QRCodeModel from "../models/qrcodeModel.ts";

export const convertURLToQR = async (req: Request, res: Response) : Promise<void> => {
  try {
    const url = req.body.url;

    if (!url) {
      res.status(400).json({ success: false, message: "URL is required" });
      
    }

    const isFound = await QRCodeModel.findOne({ url });
    if (isFound) {
      res.status(200).json({
        success: true,
        message: "QR already exists in DB.",
        dataUrl: isFound.qr,
      });
      return;
    }

    const dataUrl = await QRCode.toDataURL(url);

    const newQR = new QRCodeModel({
      url,
      qr: dataUrl,
      expiresAt: new Date(Date.now() + 60 * 60 * 24 * 1000) 
    });

    if(req.user) {
      newQR.user = req.user._id
    }

    await newQR.save();

    res.status(201).json({
      success: true,
      message: "QR code created successfully.",
      dataUrl,
    });
  } catch (error) {
    console.error("QR generation error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while generating QR code.",
    });
  }
};

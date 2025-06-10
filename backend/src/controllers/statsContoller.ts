import { Request, Response } from "express";
import urlModel from "../models/urlModel.ts";

export const getAllLinksByUserId = async (
  req: Request ,
  res: Response
): Promise<void> => {
  try {
    console.log("Request User", req.user)
    if (!req.user || !req.user._id) {
      res
        .status(401)
        .json({ message: "Unauthorized: user not authenticated." });
      return;
    }

    const user = req.user._id;

    let links = await urlModel.find({ user }).sort({ createdAt: -1 });

    if (links.length === 0) {
      links = [];
    }
    res.status(200).json({ links });
    return;
  } catch (err) {
    res
      .status(500)
      .json({ message: "Something went wrong while retrieving links." });
    return;
  }
};

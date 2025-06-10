import mongoose from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: mongoose.Types.ObjectId;
        email?: string;
        name?: string;
        // Add more fields as needed from your User model
      };
    }
  }
}

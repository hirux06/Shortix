import mongoose from "mongoose";

const qrCodeSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    qr: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

qrCodeSchema.index({expiresAt: 1}, {expireAfterSeconds: 0});

const QRCodeModel = mongoose.model("Qrcode", qrCodeSchema);

export default QRCodeModel;

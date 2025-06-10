import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import dbConnect from './utils/dbConnect.js';
import shortenUrlRoute from './routes/shortenUrlRoute.js';
import { redirectUrl } from './controllers/redirectController.js';
import { validateLongUrlMiddleware, validateQRUrl, validateShortUrlMiddleware } from './middlewares/urlValidator.js';
import authRouter from './routes/authRoutes.js';
import cookieParser from 'cookie-parser'
import { authMiddleware } from './middlewares/authValidator.js';
import generateQRRoutes from './routes/generateQRRoutes.js';
import cors from 'cors';
import statsRoutes from './routes/statsRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))

const main = async () => {
  await dbConnect()
}

main()


const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:3000',           
  'https://shortix-five.vercel.app'  
];

app.use(cors({
  origin: function (origin, callback) {
    
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(cookieParser());

app.use("/auth", authRouter)
app.use("/create",authMiddleware,validateLongUrlMiddleware,shortenUrlRoute)
app.use("/generateQR", authMiddleware, validateQRUrl, generateQRRoutes)
app.use("/generateStats", authMiddleware, statsRoutes)
app.get("/:url",validateShortUrlMiddleware, redirectUrl)


app.get('/', (_req: Request, res: Response) => {
  res.send('Hello, world!');
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
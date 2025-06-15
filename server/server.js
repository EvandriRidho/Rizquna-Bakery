import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'
import connectDB from './configs/db.js'
import 'dotenv/config'
import userRouter from './routes/userRoute.js';
import sellerRouter from './routes/sellerRoute.js';
import productRouter from './routes/productRoute.js';
import connectCloudinary from './configs/cloudinary.js';


const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();
await connectCloudinary();

// CORS
const allowedOrigins = ['http://localhost:5173'];

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

// Routes
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
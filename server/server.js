import cookieParser from 'cookie-parser';
import express from 'express'
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 3000;

// CORS
const allowedOrigins = ['http://localhost:5173'];

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: allowedOrigins, credentials: true }))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})
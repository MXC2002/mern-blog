import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

// Connect to db
mongoose.connect(process.env.MONGODB)
    .then(() => {
        app.listen(5000, () => {
            console.log('Connected to MongoDB & Server running on port 5000!!');
        })
    })
    .catch((err) => {
        console.log(err);
    })


// Routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
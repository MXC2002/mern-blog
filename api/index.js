import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import favoriteRoutes from './routes/favorite.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

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

const __dirname = path.resolve()


const app = express();

app.use(express.json());
app.use(cookieParser());



// Routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/post', postRoutes)
app.use('/api/comment', commentRoutes)
app.use('/api/favorite', favoriteRoutes)

app.use(express.static(path.join(__dirname, '/client/dist')))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    })
})
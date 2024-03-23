import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js';

dotenv.config();

const app = express();

// Connect to db
mongoose.connect(process.env.MONGODB)
    .then(() => {
        app.listen(5000, () => {
            console.log('Connected to MongoDB & Server running on port 5000!!');
        })
    })
    .catch((err) => {
        console.log(err);
    });


// Routes
app.use('/api/user', userRoutes)



import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();

const app = express();


mongoose.connect(process.env.MONGODB)
    .then(() => {
        app.listen(5000, () => {
            console.log('Connected to MongoDB & Server running on port 5000!!');
        })
    })
    .catch((err) => {
        console.log(err);
    });

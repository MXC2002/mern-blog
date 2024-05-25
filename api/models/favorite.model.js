import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
    {
        postId: {
            type: String,
            required: true
        },
        userId: {
            type: String,
            required: true
        },
    },
    { timestamps: true }
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

export default Favorite;

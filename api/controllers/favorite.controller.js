import Favorite from '../models/favorite.model.js';
import { errorHandler } from '../utils/error.js';

export const getFavoriteStatus = async (req, res, next) => {
    try {
        const favorite = await Favorite.findOne({
            postId: req.params.postId,
            userId: req.user.id,
        });
        res.status(200).json({
            isFavorited: !!favorite,
        });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const toggleFavorite = async (req, res, next) => {
    if (!req.user.id) {
        return next(errorHandler(401, 'Bạn phải đăng nhập để yêu thích bài viết này'));
    }
    try {
        const { postId } = req.params;
        const userId = req.user.id;

        let favorite = await Favorite.findOne({ postId, userId });

        if (favorite) {
            // Bỏ yêu thích
            await Favorite.deleteOne({ postId, userId });
            favorite = null;
        } else {
            // Thêm yêu thích
            favorite = new Favorite({ postId, userId });
            await favorite.save();
        }

        const favoritesCount = await Favorite.countDocuments({ postId });
        res.status(200).json({ isFavorited: !!favorite, favoritesCount });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const getFavoritesCount = async (req, res, next) => {
    try {
        const favoritesCount = await Favorite.countDocuments({ postId: req.params.postId });
        res.status(200).json({ favoritesCount });
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

export const getUserFavorites = async (req, res, next) => {
    try {
        const favorites = await Favorite.find({ userId: req.params.userId });
        res.status(200).json(favorites);
    } catch (error) {
        next(errorHandler(500, error.message));
    }
};

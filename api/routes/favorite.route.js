import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { toggleFavorite, getFavoriteStatus, getFavoritesCount } from '../controllers/favorite.controller.js';

const router = express.Router();

// Route để lấy trạng thái yêu thích của một bài viết
router.get('/:postId', verifyToken, getFavoriteStatus);

// Route để thêm hoặc bỏ yêu thích một bài viết
router.post('/:postId', verifyToken, toggleFavorite);

// Route để lấy số lượng yêu thích của một bài viết
router.get('/:postId/count', getFavoritesCount);

export default router;

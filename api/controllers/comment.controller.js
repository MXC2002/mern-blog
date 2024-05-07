import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

export const createComment = async (req, res, next) => {
    try {
        const { content, postId, userId } = req.body;

        if (userId !== req.user.id) {
            return next(errorHandler(403, 'Bạn không được phép bình luận bài viết này'));
        }

        if (content.length <= 0) {
            return next(errorHandler(400, 'Nội dung bình luận không được để trống'));
        }

        const newComment = new Comment({
            content,
            postId,
            userId
        })

        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        next(error);
    }
}
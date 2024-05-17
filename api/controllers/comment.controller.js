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

export const getPostComments = async (req, res, next) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).sort({
            createdAt: -1.
        });
        res.status(200).json(comments);
    } catch (error) {
        next(error);
    }
}

export const likeComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Không tìm thấy bình luận'));
        }
        const userIndex = comment.likes.indexOf(req.user.id);
        if (userIndex === -1) {
            comment.numberOfLikes += 1;
            comment.likes.push(req.user.id);
        } else {
            comment.numberOfLikes -= 1;
            comment.likes.splice(userIndex, 1);
        }
        await comment.save();
        res.status(200).json(comment);
    } catch (error) {
        next(error);
    }
}

export const editComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Không tìm thấy bình luận'));
        };
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'Bạn không được phép chỉnh sửa bình luận này'));
        };

        const editedComment = await Comment.findByIdAndUpdate(req.params.commentId,
            {
                content: req.body.content,
            }, { new: true }
        );

        res.status(200).json(editedComment);
    } catch (error) {
        next(error);
    }
}

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return next(errorHandler(404, 'Không tìm thấy bình luận'));
        };
        if (comment.userId !== req.user.id && !req.user.isAdmin) {
            return next(errorHandler(403, 'Bạn không được phép xóa bình luận này'));
        }
        await Comment.findByIdAndDelete(req.params.commentId);
        res.status(200).json('Bình luận đã bị xóa');
    } catch (error) {
        next(error);
    }
}

export const getcomments = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Bạn không được phép xem danh sách bình luận này'));
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 8;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const comments = await Comment.find()
            .sort({ createdAt: sortDirection })
            .skip(startIndex)
            .limit(limit);
        const totalComments = await Comment.countDocuments();
        const now = new Date();
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
        );
        const lastMonthComments = await Comment.countDocuments({
            createdAt: {
                $gte: oneMonthAgo
            }
        });
        res.status(200).json({
            comments,
            totalComments,
            lastMonthComments,
        })
    } catch (error) {
        next(error);
    }
}
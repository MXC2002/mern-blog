import unidecode from "unidecode";
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Bạn không được phép tạo bài viết'));
    }
    if (!req.body.title && !req.body.content) {
        return next(errorHandler(400, 'Tất cả các trường là bắt buộc'));
    }
    if (!req.body.title) {
        return next(errorHandler(400, 'Tiêu đề không được bỏ trống'));
    }
    if (!req.body.content) {
        return next(errorHandler(400, 'Nội dung không được bỏ trống'));
    }
    const latinTitle = unidecode(req.body.title);
    const slug = latinTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const newPost = new Post({
        ...req.body,
        slug,
        userId: req.user.id
    });

    try {
        const savedPpost = await newPost.save();
        res.status(201).json(savedPpost);
    } catch (error) {
        next(error);
    }
}

export const getposts = async (req, res, next) => {
    try {
        const startIndex = parseInt(req.query.startIndex) || 0;
        const limit = parseInt(req.query.limit) || 9;
        const sortDirection = req.query.sort === 'asc' ? 1 : -1;
        const posts = await Post.find({
            ...(req.query.userId && { userId: req.query.userId }),
            ...(req.query.category && { category: req.query.category }),
            ...(req.query.slug && { slug: req.query.slug }),
            ...(req.query.postId && { _id: req.query.postId }),
            ...(req.query.searchTerm && {
                $or: [
                    { title: { $regex: req.query.searchTerm, $options: 'i' } },
                    { content: { $regex: req.query.searchTerm, $options: 'i' } }
                ],
            }),
        }).sort({ updatedAt: sortDirection }).skip(startIndex).limit(limit);

        const totalPosts = await Post.countDocuments();

        const now = new Date();

        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate(),
        );

        const lastMonthPosts = await Post.countDocuments({
            createdAt: { $gte: oneMonthAgo },
        });

        res.status(200).json({
            posts,
            totalPosts,
            lastMonthPosts,
        })

    } catch (error) {
        next(error);
    }
}

export const deletepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Bạn không được phép xóa bài viết này'));
    }
    try {
        await Post.findByIdAndDelete(req.params.postId);
        res.status(200).json('Bài viết đã bị xóa');
    } catch (error) {
        next(error)
    }
}

export const updatepost = async (req, res, next) => {
    if (!req.user.isAdmin || req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Bạn không được phép cập nhật bài viết này'));
    }
    if (!req.body.title && !req.body.content) {
        return next(errorHandler(400, 'Tất cả các trường là bắt buộc'));
    }
    if (!req.body.title) {
        return next(errorHandler(400, 'Tiêu đề không được bỏ trống'));
    }
    if (!req.body.content) {
        return next(errorHandler(400, 'Nội dung không được bỏ trống'));
    }

    const latinTitle = unidecode(req.body.title);
    const newSlug = latinTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    
    try {
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId, {
            $set: {
                title: req.body.title,
                content: req.body.content,
                category: req.body.category,
                image: req.body.image,
                slug: newSlug,
            }
        }, { new: true })
        res.status(200).json(updatedPost);
    } catch (error) {
        next(error);
    }
}
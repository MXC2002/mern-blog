import unidecode from "unidecode";
import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, 'Bạn không được phép tạo bài viết'));
    }
    if (!req.body.title || !req.body.content) {
        return next(errorHandler(400, 'Tất cả các trường là bắt buộc'));
    }

    const latinTitle= unidecode(req.body.title);
    const slug = latinTitle.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
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
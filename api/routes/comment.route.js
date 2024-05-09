import express from 'express';
import { createComment, getPostComments, likeComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const route = express.Router();

route.post('/create', verifyToken, createComment);
route.get('/getpostcomments/:postId', getPostComments);
route.put('/likecomment/:commentId', verifyToken, likeComment);

export default route;
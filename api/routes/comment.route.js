import express from 'express';
import { createComment, deleteComment, editComment, getPostComments, likeComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const route = express.Router();

route.post('/create', verifyToken, createComment);
route.get('/getpostcomments/:postId', getPostComments);
route.put('/likecomment/:commentId', verifyToken, likeComment);
route.put('/editcomment/:commentId', verifyToken, editComment);
route.delete('/deletecomment/:commentId', verifyToken, deleteComment);

export default route;
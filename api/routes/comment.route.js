import express from 'express';
import { createComment, getPostComments } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const route = express.Router();

route.post('/create', verifyToken, createComment);
route.get('/getpostcomments/:postId', getPostComments);

export default route;
import express from 'express';
import { createComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const route = express.Router();

route.post('/create', verifyToken, createComment);

export default route;
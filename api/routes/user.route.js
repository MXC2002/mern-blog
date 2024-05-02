import express from 'express';
import { deleteUser, test, updateUser, logout, getUsers } from '../controllers/user.controller.js'
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get('/test', test);
router.put('/update/:userId', verifyToken, updateUser);
router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/logout', logout)
router.get('/getusers', verifyToken, getUsers)

export default router;
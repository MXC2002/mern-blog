import express from 'express';
import { signup, login, google, verifyUser, forgotPassword, resetPassword } from '../controllers/auth.controller.js'

const router = express.Router();

router.post('/signup', signup)
router.post('/verify', verifyUser)
router.post('/forgot-password', forgotPassword)
router.put('/reset-password', resetPassword)
router.post('/login', login)
router.post('/google', google)

export default router;

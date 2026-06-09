import express from 'express';
import { login, getMe, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/changepassword', protect, changePassword);

export default router;

import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, getMe, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: {
    success: false,
    error: 'Too many login attempts from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const router = express.Router();

router.post('/login', loginLimiter, login);
router.get('/me', protect, getMe);
router.put('/changepassword', protect, changePassword);

export default router;

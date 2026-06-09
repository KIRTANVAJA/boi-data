import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { logActivity } from '../middleware/activityLogger.js';

// Generate JWT token helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecurejwtsecretkey_gold_accent_theme_2026', {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Please provide username and password' });
    }

    // Check for user
    const user = await User.findOne({ username }).select('+password');
    if (!user) {
      await logActivity('System', 'LOGIN_FAIL', `Attempted login with username: ${username}`, req);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      await logActivity(username, 'LOGIN_FAIL', `Incorrect password attempt`, req);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Token response
    const token = generateToken(user._id);

    await logActivity(username, 'LOGIN_SUCCESS', `Logged in successfully`, req);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/auth/changepassword
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please enter current and new password' });
    }

    const user = await User.findById(req.user.id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Incorrect current password' });
    }

    user.password = newPassword;
    await user.save();

    await logActivity(user.username, 'CHANGE_PASSWORD', `Changed login password`, req);

    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

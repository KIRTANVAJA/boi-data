import jwt from 'jsonwebtoken';
import { queryOne } from '../config/sqliteDb.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecurejwtsecretkey_gold_accent_theme_2026');

      req.user = await queryOne('SELECT id, username, email FROM users WHERE id = ?', [decoded.id]);
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'User not found' });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ success: false, error: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, error: 'Not authorized, no token provided' });
  }
};

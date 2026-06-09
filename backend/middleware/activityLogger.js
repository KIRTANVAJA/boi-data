import { run } from '../config/sqliteDb.js';

export const logActivity = async (username, action, details, req) => {
  try {
    const ip = req ? req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress : 'System';
    await run(
      'INSERT INTO activity_logs (username, action, details, ip) VALUES (?, ?, ?, ?)',
      [username || 'System', action, details, ip]
    );
  } catch (error) {
    console.error('Failed to write activity log:', error.message);
  }
};

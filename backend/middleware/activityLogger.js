import ActivityLog from '../models/ActivityLog.js';

export const logActivity = async (username, action, details, req) => {
  try {
    const ip = req ? req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress : 'System';
    await ActivityLog.create({
      adminUser: username || 'System',
      action,
      details,
      ip,
    });
  } catch (error) {
    console.error('Failed to write activity log:', error.message);
  }
};

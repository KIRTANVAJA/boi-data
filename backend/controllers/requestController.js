import { query, run, queryOne } from '../config/sqliteDb.js';

// --- CONTACT REQUESTS ACTIONS ---

export const submitContactRequest = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and message' });
    }

    const result = await run(
      'INSERT INTO contact_requests (name, email, subject, message, status) VALUES (?, ?, ?, ?, ?)',
      [name, email, subject || '', message, 'Pending']
    );

    const request = await queryOne('SELECT * FROM contact_requests WHERE id = ?', [result.id]);
    request._id = request.id;

    res.status(201).json({ success: true, data: request, message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const getContactRequests = async (req, res, next) => {
  try {
    const requests = await query('SELECT * FROM contact_requests ORDER BY createdAt DESC');
    const formatted = requests.map(r => ({ ...r, _id: r.id }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const updateContactRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    await run('UPDATE contact_requests SET status = ? WHERE id = ?', [status, req.params.id]);

    const request = await queryOne('SELECT * FROM contact_requests WHERE id = ?', [req.params.id]);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Contact request not found' });
    }
    request._id = request.id;

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const deleteContactRequest = async (req, res, next) => {
  try {
    const request = await queryOne('SELECT * FROM contact_requests WHERE id = ?', [req.params.id]);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Contact request not found' });
    }

    await run('DELETE FROM contact_requests WHERE id = ?', [req.params.id]);

    res.status(200).json({ success: true, message: 'Contact request deleted' });
  } catch (error) {
    next(error);
  }
};

// --- ANALYTICS VIEWS ACTIONS ---

export const trackPageView = async (req, res, next) => {
  try {
    const { page } = req.body;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

    // Basic UserAgent parsing
    let browser = 'Other';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    let device = 'Desktop';
    if (/Mobile|Android|iP(hone|od)/.test(userAgent)) device = 'Mobile';
    else if (/iPad|Tablet/.test(userAgent)) device = 'Tablet';

    // Mock country check to make charts interesting
    const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Germany'];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    const country = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('::ffff:127.0.0.1') ? 'Local' : randomCountry;

    await run(
      'INSERT INTO page_views (path, ip, userAgent) VALUES (?, ?, ?)',
      [page || '/', ip, userAgent]
    );

    // Also track in settings/analytics helper if needed, but page_views handles it.
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalViewsRow = await queryOne('SELECT COUNT(*) as count FROM page_views');
    const totalRequestsRow = await queryOne('SELECT COUNT(*) as count FROM contact_requests');
    const pendingRequestsRow = await queryOne("SELECT COUNT(*) as count FROM contact_requests WHERE status = 'Pending' OR status = 'unread'");

    const totalViews = totalViewsRow ? totalViewsRow.count : 0;
    const totalRequests = totalRequestsRow ? totalRequestsRow.count : 0;
    const pendingRequests = pendingRequestsRow ? pendingRequestsRow.count : 0;

    // Aggregate Views by Date (Last 7 Days)
    const viewsTrend = await query(`
      SELECT strftime('%Y-%m-%d', createdAt) as _id, COUNT(*) as count 
      FROM page_views 
      WHERE createdAt >= datetime('now', '-7 days') 
      GROUP BY _id 
      ORDER BY _id ASC
    `);

    // Aggregate Devices
    const deviceDistribution = await query(`
      SELECT 'Desktop' as _id, COUNT(*) as count FROM page_views WHERE userAgent NOT LIKE '%Mobile%' AND userAgent NOT LIKE '%Android%'
      UNION
      SELECT 'Mobile' as _id, COUNT(*) as count FROM page_views WHERE userAgent LIKE '%Mobile%' OR userAgent LIKE '%Android%'
    `);

    // Aggregate Browsers
    const browserDistribution = await query(`
      SELECT 'Chrome' as _id, COUNT(*) as count FROM page_views WHERE userAgent LIKE '%Chrome%'
      UNION
      SELECT 'Safari' as _id, COUNT(*) as count FROM page_views WHERE userAgent LIKE '%Safari%' AND userAgent NOT LIKE '%Chrome%'
      UNION
      SELECT 'Firefox' as _id, COUNT(*) as count FROM page_views WHERE userAgent LIKE '%Firefox%'
      UNION
      SELECT 'Other' as _id, COUNT(*) as count FROM page_views WHERE userAgent NOT LIKE '%Chrome%' AND userAgent NOT LIKE '%Safari%' AND userAgent NOT LIKE '%Firefox%'
    `);

    // Recent contact requests
    const recentRequestsRaw = await query('SELECT * FROM contact_requests ORDER BY createdAt DESC LIMIT 5');
    const recentRequests = recentRequestsRaw.map(r => ({ ...r, _id: r.id }));

    // Recent Admin activity logs
    const recentLogsRaw = await query('SELECT * FROM activity_logs ORDER BY createdAt DESC LIMIT 5');
    const recentLogs = recentLogsRaw.map(l => ({ ...l, _id: l.id, timestamp: l.createdAt }));

    res.status(200).json({
      success: true,
      stats: {
        totalViews,
        totalRequests,
        pendingRequests,
        viewsTrend,
        deviceDistribution,
        browserDistribution,
        recentRequests,
        recentLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// --- ACTIVITY LOGS ACTIONS ---

export const getActivityLogs = async (req, res, next) => {
  try {
    const logs = await query('SELECT * FROM activity_logs ORDER BY createdAt DESC');
    const formatted = logs.map(l => ({ ...l, _id: l.id, timestamp: l.createdAt }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

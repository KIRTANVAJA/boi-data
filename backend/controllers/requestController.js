import ContactRequest from '../models/ContactRequest.js';
import Analytics from '../models/Analytics.js';
import ActivityLog from '../models/ActivityLog.js';

// --- CONTACT REQUESTS ACTIONS ---

export const submitContactRequest = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and message' });
    }

    const request = await ContactRequest.create({ name, email, subject, message });
    res.status(201).json({ success: true, data: request, message: 'Message sent successfully' });
  } catch (error) {
    next(error);
  }
};

export const getContactRequests = async (req, res, next) => {
  try {
    const requests = await ContactRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: requests });
  } catch (error) {
    next(error);
  }
};

export const updateContactRequestStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const request = await ContactRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ success: false, error: 'Contact request not found' });
    }

    res.status(200).json({ success: true, data: request });
  } catch (error) {
    next(error);
  }
};

export const deleteContactRequest = async (req, res, next) => {
  try {
    const request = await ContactRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, error: 'Contact request not found' });
    }

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

    await Analytics.create({
      page: page || '/',
      ip,
      browser,
      device,
      country: ip === '127.0.0.1' || ip === '::1' || ip.startsWith('::ffff:127.0.0.1') ? 'Local' : randomCountry,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const totalViews = await Analytics.countDocuments();
    const totalRequests = await ContactRequest.countDocuments();
    const pendingRequests = await ContactRequest.countDocuments({ status: 'Pending' });

    // Aggregate Views by Date (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const viewsTrend = await Analytics.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Aggregate Devices
    const deviceDistribution = await Analytics.aggregate([
      {
        $group: {
          _id: '$device',
          count: { $sum: 1 },
        },
      },
    ]);

    // Aggregate Browsers
    const browserDistribution = await Analytics.aggregate([
      {
        $group: {
          _id: '$browser',
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent contact requests
    const recentRequests = await ContactRequest.find().sort({ createdAt: -1 }).limit(5);

    // Recent Admin activity logs
    const recentLogs = await ActivityLog.find().sort({ timestamp: -1 }).limit(5);

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
    const logs = await ActivityLog.find().sort({ timestamp: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

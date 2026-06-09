import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema(
  {
    timestamp: { type: Date, default: Date.now },
    ip: { type: String, default: '' },
    device: { type: String, default: 'Desktop' },
    browser: { type: String, default: 'Chrome' },
    country: { type: String, default: 'Local' },
    page: { type: String, default: '/' },
  },
  { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;

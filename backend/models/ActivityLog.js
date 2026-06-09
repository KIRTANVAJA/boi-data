import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema(
  {
    adminUser: { type: String, required: true },
    action: { type: String, required: true }, // e.g. "UPDATE_PROFILE", "DELETE_PROJECT", "LOGIN"
    details: { type: String, default: '' },
    ip: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
export default ActivityLog;

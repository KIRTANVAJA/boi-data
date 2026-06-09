import express from 'express';
import {
  submitContactRequest,
  getContactRequests,
  updateContactRequestStatus,
  deleteContactRequest,
  trackPageView,
  getDashboardStats,
  getActivityLogs,
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/contact', submitContactRequest);
router.post('/analytics/view', trackPageView);

// Protected contact requests routes
router.get('/contact', protect, getContactRequests);
router.put('/contact/:id', protect, updateContactRequestStatus);
router.delete('/contact/:id', protect, deleteContactRequest);

// Protected analytics & logs routes
router.get('/analytics/dashboard', protect, getDashboardStats);
router.get('/logs', protect, getActivityLogs);

export default router;

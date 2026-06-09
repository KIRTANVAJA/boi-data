import express from 'express';
import {
  getProfile,
  updateProfile,
  getFamily,
  updateFamily,
  getEducationCareer,
  updateEducationCareer,
  getLifestyle,
  updateLifestyle,
  getSettings,
  updateSettings,
  exportBackup,
  importBackup,
} from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public read routes
router.get('/', getProfile);
router.get('/family', getFamily);
router.get('/education-career', getEducationCareer);
router.get('/lifestyle', getLifestyle);
router.get('/settings', getSettings);

// Protected update routes
router.put('/', protect, upload.single('profileImage'), updateProfile);
router.put('/family', protect, updateFamily);
router.put('/education-career', protect, updateEducationCareer);
router.put('/lifestyle', protect, updateLifestyle);
router.put('/settings', protect, updateSettings);

// Protected backup routes
router.get('/backup/export', protect, exportBackup);
router.post('/backup/import', protect, importBackup);

export default router;

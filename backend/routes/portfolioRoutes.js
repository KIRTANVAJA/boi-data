import express from 'express';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getGallery,
  createGalleryItem,
  deleteGalleryItem,
} from '../controllers/portfolioController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public read routes
router.get('/projects', getProjects);
router.get('/achievements', getAchievements);
router.get('/gallery', getGallery);

// Protected projects routes
router.post('/projects', protect, upload.single('image'), createProject);
router.put('/projects/:id', protect, upload.single('image'), updateProject);
router.delete('/projects/:id', protect, deleteProject);
router.post('/projects/reorder', protect, reorderProjects);

// Protected achievements routes
router.post('/achievements', protect, upload.single('document'), createAchievement);
router.put('/achievements/:id', protect, upload.single('document'), updateAchievement);
router.delete('/achievements/:id', protect, deleteAchievement);

// Protected gallery routes
router.post('/gallery', protect, upload.single('media'), createGalleryItem);
router.delete('/gallery/:id', protect, deleteGalleryItem);

export default router;

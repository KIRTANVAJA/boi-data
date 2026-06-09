import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Gallery from '../models/Gallery.js';
import { handleFileUpload } from '../middleware/upload.js';
import { logActivity } from '../middleware/activityLogger.js';

// --- PROJECTS ACTIONS ---

export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      projectData.image = await handleFileUpload(req.file);
    }
    // Get last project order to place at the end
    const lastProject = await Project.findOne().sort({ order: -1 });
    projectData.order = lastProject ? lastProject.order + 1 : 0;

    if (req.body.tags && typeof req.body.tags === 'string') {
      projectData.tags = req.body.tags.split(',').map((t) => t.trim());
    }

    const project = await Project.create(projectData);
    await logActivity(req.user.username, 'CREATE_PROJECT', `Added portfolio project: ${project.title}`, req);

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      projectData.image = await handleFileUpload(req.file);
    }

    if (req.body.tags && typeof req.body.tags === 'string') {
      projectData.tags = req.body.tags.split(',').map((t) => t.trim());
    }

    const project = await Project.findByIdAndUpdate(req.params.id, projectData, {
      new: true,
      runValidators: true,
    });

    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await logActivity(req.user.username, 'UPDATE_PROJECT', `Updated portfolio project: ${project.title}`, req);

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await logActivity(req.user.username, 'DELETE_PROJECT', `Deleted portfolio project: ${project.title}`, req);

    res.status(200).json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const reorderProjects = async (req, res, next) => {
  try {
    const { orderList } = req.body; // Array of IDs in the preferred sorted order: [id1, id2, id3...]
    if (!orderList || !Array.isArray(orderList)) {
      return res.status(400).json({ success: false, error: 'orderList array is required' });
    }

    const bulkOps = orderList.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } },
      },
    }));

    await Project.bulkWrite(bulkOps);
    await logActivity(req.user.username, 'REORDER_PROJECTS', 'Reordered portfolio project items list', req);

    res.status(200).json({ success: true, message: 'Projects reordered successfully' });
  } catch (error) {
    next(error);
  }
};

// --- ACHIEVEMENTS ACTIONS ---

export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: achievements });
  } catch (error) {
    next(error);
  }
};

export const createAchievement = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.documentUrl = await handleFileUpload(req.file);
    }

    const achievement = await Achievement.create(data);
    await logActivity(req.user.username, 'CREATE_ACHIEVEMENT', `Added achievement: ${achievement.title}`, req);

    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
};

export const updateAchievement = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.documentUrl = await handleFileUpload(req.file);
    }

    const achievement = await Achievement.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!achievement) {
      return res.status(404).json({ success: false, error: 'Achievement not found' });
    }

    await logActivity(req.user.username, 'UPDATE_ACHIEVEMENT', `Updated achievement: ${achievement.title}`, req);

    res.status(200).json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
};

export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);
    if (!achievement) {
      return res.status(404).json({ success: false, error: 'Achievement not found' });
    }

    await logActivity(req.user.username, 'DELETE_ACHIEVEMENT', `Deleted achievement: ${achievement.title}`, req);

    res.status(200).json({ success: true, message: 'Achievement removed' });
  } catch (error) {
    next(error);
  }
};

// --- GALLERY ACTIONS ---

export const getGallery = async (req, res, next) => {
  try {
    const media = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.mediaUrl = await handleFileUpload(req.file);
      // Auto-detect media type
      data.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    }

    if (!data.mediaUrl) {
      return res.status(400).json({ success: false, error: 'Please upload media file or supply URL' });
    }

    const media = await Gallery.create(data);
    await logActivity(req.user.username, 'CREATE_GALLERY_ITEM', `Uploaded gallery item: ${media.title || 'Untitled'}`, req);

    res.status(201).json({ success: true, data: media });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const media = await Gallery.findByIdAndDelete(req.params.id);
    if (!media) {
      return res.status(404).json({ success: false, error: 'Gallery item not found' });
    }

    await logActivity(req.user.username, 'DELETE_GALLERY_ITEM', `Deleted gallery media: ${media.title || 'Untitled'}`, req);

    res.status(200).json({ success: true, message: 'Gallery media removed' });
  } catch (error) {
    next(error);
  }
};

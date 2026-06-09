import Profile from '../models/Profile.js';
import Family from '../models/Family.js';
import EducationCareer from '../models/EducationCareer.js';
import Lifestyle from '../models/Lifestyle.js';
import Settings from '../models/Settings.js';
import Project from '../models/Project.js';
import Achievement from '../models/Achievement.js';
import Gallery from '../models/Gallery.js';
import { handleFileUpload } from '../middleware/upload.js';
import { logActivity } from '../middleware/activityLogger.js';

// --- PROFILE ACTIONS ---

export const getProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = await Profile.create({ fullName: 'New User' });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne();
    const updateData = { ...req.body };

    if (req.file) {
      const imageUrl = await handleFileUpload(req.file);
      updateData.profileImage = imageUrl;
    }

    if (!profile) {
      profile = await Profile.create(updateData);
    } else {
      profile = await Profile.findByIdAndUpdate(profile._id, updateData, {
        new: true,
        runValidators: true,
      });
    }

    await logActivity(req.user?.username || 'System', 'UPDATE_PROFILE', 'Updated profile & personal info details', req);

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

// --- FAMILY ACTIONS ---

export const getFamily = async (req, res, next) => {
  try {
    let family = await Family.findOne();
    if (!family) {
      family = await Family.create({});
    }
    res.status(200).json({ success: true, data: family });
  } catch (error) {
    next(error);
  }
};

export const updateFamily = async (req, res, next) => {
  try {
    let family = await Family.findOne();
    if (!family) {
      family = await Family.create(req.body);
    } else {
      family = await Family.findByIdAndUpdate(family._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await logActivity(req.user?.username || 'System', 'UPDATE_FAMILY', 'Updated family profile details', req);

    res.status(200).json({ success: true, data: family });
  } catch (error) {
    next(error);
  }
};

// --- EDUCATION & CAREER ACTIONS ---

export const getEducationCareer = async (req, res, next) => {
  try {
    let edCar = await EducationCareer.findOne();
    if (!edCar) {
      edCar = await EducationCareer.create({ education: [], experience: [], skills: [], certifications: [], futureGoals: [] });
    }
    res.status(200).json({ success: true, data: edCar });
  } catch (error) {
    next(error);
  }
};

export const updateEducationCareer = async (req, res, next) => {
  try {
    let edCar = await EducationCareer.findOne();
    if (!edCar) {
      edCar = await EducationCareer.create(req.body);
    } else {
      edCar = await EducationCareer.findByIdAndUpdate(edCar._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await logActivity(req.user?.username || 'System', 'UPDATE_EDUCATION_CAREER', 'Updated education/career timeline details', req);

    res.status(200).json({ success: true, data: edCar });
  } catch (error) {
    next(error);
  }
};

// --- LIFESTYLE ACTIONS ---

export const getLifestyle = async (req, res, next) => {
  try {
    let lifestyle = await Lifestyle.findOne();
    if (!lifestyle) {
      lifestyle = await Lifestyle.create({ hobbies: [], interests: [], fitness: '', travel: [], languages: [] });
    }
    res.status(200).json({ success: true, data: lifestyle });
  } catch (error) {
    next(error);
  }
};

export const updateLifestyle = async (req, res, next) => {
  try {
    let lifestyle = await Lifestyle.findOne();
    if (!lifestyle) {
      lifestyle = await Lifestyle.create(req.body);
    } else {
      lifestyle = await Lifestyle.findByIdAndUpdate(lifestyle._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await logActivity(req.user?.username || 'System', 'UPDATE_LIFESTYLE', 'Updated lifestyle hobbies & interest options', req);

    res.status(200).json({ success: true, data: lifestyle });
  } catch (error) {
    next(error);
  }
};

// --- SETTINGS ACTIONS ---

export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      settings = await Settings.findByIdAndUpdate(settings._id, req.body, {
        new: true,
        runValidators: true,
      });
    }

    await logActivity(req.user?.username || 'System', 'UPDATE_SETTINGS', 'Updated system layout theme & SEO keywords', req);

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

// --- BACKUP / EXPORT & IMPORT ACTIONS ---

export const exportBackup = async (req, res, next) => {
  try {
    const backupData = {
      profile: await Profile.findOne(),
      family: await Family.findOne(),
      educationCareer: await EducationCareer.findOne(),
      lifestyle: await Lifestyle.findOne(),
      settings: await Settings.findOne(),
      projects: await Project.find().sort({ order: 1 }),
      achievements: await Achievement.find().sort({ date: -1 }),
      gallery: await Gallery.find().sort({ createdAt: -1 }),
    };

    res.status(200).json({
      success: true,
      timestamp: new Date(),
      data: backupData,
    });
  } catch (error) {
    next(error);
  }
};

export const importBackup = async (req, res, next) => {
  try {
    const { backup } = req.body;
    if (!backup) {
      return res.status(400).json({ success: false, error: 'No backup payload supplied' });
    }

    // Restore components
    if (backup.profile) {
      await Profile.deleteMany({});
      await Profile.create(backup.profile);
    }
    if (backup.family) {
      await Family.deleteMany({});
      await Family.create(backup.family);
    }
    if (backup.educationCareer) {
      await EducationCareer.deleteMany({});
      await EducationCareer.create(backup.educationCareer);
    }
    if (backup.lifestyle) {
      await Lifestyle.deleteMany({});
      await Lifestyle.create(backup.lifestyle);
    }
    if (backup.settings) {
      await Settings.deleteMany({});
      await Settings.create(backup.settings);
    }
    if (backup.projects && Array.isArray(backup.projects)) {
      await Project.deleteMany({});
      if (backup.projects.length > 0) {
        await Project.insertMany(backup.projects);
      }
    }
    if (backup.achievements && Array.isArray(backup.achievements)) {
      await Achievement.deleteMany({});
      if (backup.achievements.length > 0) {
        await Achievement.insertMany(backup.achievements);
      }
    }
    if (backup.gallery && Array.isArray(backup.gallery)) {
      await Gallery.deleteMany({});
      if (backup.gallery.length > 0) {
        await Gallery.insertMany(backup.gallery);
      }
    }

    await logActivity(req.user.username, 'RESTORE_BACKUP', 'Successfully restored database from file backup', req);

    res.status(200).json({ success: true, message: 'Database backup imported successfully' });
  } catch (error) {
    next(error);
  }
};

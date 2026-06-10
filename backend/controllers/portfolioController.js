import { query, run, queryOne } from '../config/sqliteDb.js';
import { handleFileUpload } from '../middleware/upload.js';
import { logActivity } from '../middleware/activityLogger.js';

// Helper to normalize tags to array of strings
const normalizeTags = (tagsField) => {
  if (!tagsField) return [];
  if (Array.isArray(tagsField)) return tagsField;
  try {
    if (tagsField.startsWith('[')) {
      return JSON.parse(tagsField);
    }
  } catch (e) {}
  return tagsField.split(',').map((t) => t.trim()).filter(Boolean);
};

// --- PROJECTS ACTIONS ---

export const getProjects = async (req, res, next) => {
  try {
    const projects = await query('SELECT * FROM projects ORDER BY item_order ASC');
    const formatted = projects.map(p => ({
      ...p,
      _id: p.id,
      tags: normalizeTags(p.tags)
    }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };
    if (req.file) {
      projectData.image = await handleFileUpload(req.file);
    } else {
      projectData.image = projectData.image || '';
    }

    const lastProject = await queryOne('SELECT MAX(item_order) as maxOrder FROM projects');
    const nextOrder = lastProject && lastProject.maxOrder !== null ? lastProject.maxOrder + 1 : 0;

    const tagsStr = Array.isArray(projectData.tags) 
      ? JSON.stringify(projectData.tags) 
      : (projectData.tags || '');

    console.log('Inserting project with order:', nextOrder, 'title:', projectData.title || 'Untitled Project');
    const result = await run(
      `INSERT INTO projects (title, description, image, tags, githubLink, demoLink, item_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        projectData.title || 'Untitled Project',
        projectData.description || '',
        projectData.image,
        tagsStr,
        projectData.githubLink || '',
        projectData.demoLink || '',
        nextOrder
      ]
    );

    const project = await queryOne('SELECT * FROM projects WHERE id = ?', [result.id]);
    project._id = project.id;
    project.tags = normalizeTags(project.tags);

    await logActivity(req.user.username, 'CREATE_PROJECT', `Added portfolio project: ${project.title}`, req);

    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const projectData = { ...req.body };
    const projectExists = await queryOne('SELECT * FROM projects WHERE id = ?', [req.params.id]);

    if (!projectExists) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    if (req.file) {
      projectData.image = await handleFileUpload(req.file);
    } else {
      projectData.image = projectData.image !== undefined ? projectData.image : projectExists.image;
    }

    const tagsStr = req.body.tags !== undefined 
      ? (Array.isArray(req.body.tags) ? JSON.stringify(req.body.tags) : req.body.tags) 
      : projectExists.tags;

    await run(
      `UPDATE projects SET 
        title = ?, description = ?, image = ?, tags = ?, githubLink = ?, demoLink = ?
       WHERE id = ?`,
      [
        projectData.title !== undefined ? projectData.title : projectExists.title,
        projectData.description !== undefined ? projectData.description : projectExists.description,
        projectData.image,
        tagsStr,
        projectData.githubLink !== undefined ? projectData.githubLink : projectExists.githubLink,
        projectData.demoLink !== undefined ? projectData.demoLink : projectExists.demoLink,
        req.params.id
      ]
    );

    const project = await queryOne('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    project._id = project.id;
    project.tags = normalizeTags(project.tags);

    await logActivity(req.user.username, 'UPDATE_PROJECT', `Updated portfolio project: ${project.title}`, req);

    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await queryOne('SELECT * FROM projects WHERE id = ?', [req.params.id]);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }

    await run('DELETE FROM projects WHERE id = ?', [req.params.id]);

    await logActivity(req.user.username, 'DELETE_PROJECT', `Deleted portfolio project: ${project.title}`, req);

    res.status(200).json({ success: true, message: 'Project removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const reorderProjects = async (req, res, next) => {
  try {
    const { orderList } = req.body; // Array of IDs: [id1, id2, id3...]
    if (!orderList || !Array.isArray(orderList)) {
      return res.status(400).json({ success: false, error: 'orderList array is required' });
    }

    for (let index = 0; index < orderList.length; index++) {
      const id = orderList[index];
      await run('UPDATE projects SET item_order = ? WHERE id = ?', [index, id]);
    }

    await logActivity(req.user.username, 'REORDER_PROJECTS', 'Reordered portfolio project items list', req);

    res.status(200).json({ success: true, message: 'Projects reordered successfully' });
  } catch (error) {
    next(error);
  }
};

// --- ACHIEVEMENTS ACTIONS ---

export const getAchievements = async (req, res, next) => {
  try {
    const achievements = await query('SELECT * FROM achievements ORDER BY date DESC, id DESC');
    const formatted = achievements.map(a => ({ ...a, _id: a.id }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const createAchievement = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.documentUrl = await handleFileUpload(req.file);
    } else {
      data.documentUrl = data.documentUrl || '';
    }

    const result = await run(
      `INSERT INTO achievements (title, description, category, date, documentUrl)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.title || 'Untitled Achievement',
        data.description || '',
        data.category || '',
        data.date || '',
        data.documentUrl
      ]
    );

    const achievement = await queryOne('SELECT * FROM achievements WHERE id = ?', [result.id]);
    achievement._id = achievement.id;

    await logActivity(req.user.username, 'CREATE_ACHIEVEMENT', `Added achievement: ${achievement.title}`, req);

    res.status(201).json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
};

export const updateAchievement = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const achievementExists = await queryOne('SELECT * FROM achievements WHERE id = ?', [req.params.id]);

    if (!achievementExists) {
      return res.status(404).json({ success: false, error: 'Achievement not found' });
    }

    if (req.file) {
      data.documentUrl = await handleFileUpload(req.file);
    } else {
      data.documentUrl = data.documentUrl !== undefined ? data.documentUrl : achievementExists.documentUrl;
    }

    await run(
      `UPDATE achievements SET 
        title = ?, description = ?, category = ?, date = ?, documentUrl = ?
       WHERE id = ?`,
      [
        data.title !== undefined ? data.title : achievementExists.title,
        data.description !== undefined ? data.description : achievementExists.description,
        data.category !== undefined ? data.category : achievementExists.category,
        data.date !== undefined ? data.date : achievementExists.date,
        data.documentUrl,
        req.params.id
      ]
    );

    const achievement = await queryOne('SELECT * FROM achievements WHERE id = ?', [req.params.id]);
    achievement._id = achievement.id;

    await logActivity(req.user.username, 'UPDATE_ACHIEVEMENT', `Updated achievement: ${achievement.title}`, req);

    res.status(200).json({ success: true, data: achievement });
  } catch (error) {
    next(error);
  }
};

export const deleteAchievement = async (req, res, next) => {
  try {
    const achievement = await queryOne('SELECT * FROM achievements WHERE id = ?', [req.params.id]);
    if (!achievement) {
      return res.status(404).json({ success: false, error: 'Achievement not found' });
    }

    await run('DELETE FROM achievements WHERE id = ?', [req.params.id]);

    await logActivity(req.user.username, 'DELETE_ACHIEVEMENT', `Deleted achievement: ${achievement.title}`, req);

    res.status(200).json({ success: true, message: 'Achievement removed' });
  } catch (error) {
    next(error);
  }
};

// --- GALLERY ACTIONS ---

export const getGallery = async (req, res, next) => {
  try {
    const media = await query('SELECT * FROM gallery ORDER BY item_order ASC, id DESC');
    const formatted = media.map(m => ({
      ...m,
      _id: m.id,
      url: m.mediaUrl,
      category: m.albumName
    }));
    res.status(200).json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
};

export const createGalleryItem = async (req, res, next) => {
  try {
    const data = { ...req.body };
    const mediaUrlInput = req.body.url !== undefined ? req.body.url : req.body.mediaUrl;
    const albumNameInput = req.body.category !== undefined ? req.body.category : req.body.albumName;

    if (req.file) {
      data.mediaUrl = await handleFileUpload(req.file);
      data.mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';
    } else {
      data.mediaUrl = mediaUrlInput || '';
      data.mediaType = data.mediaType || 'image';
    }
    data.albumName = albumNameInput || 'General';

    if (!data.mediaUrl) {
      return res.status(400).json({ success: false, error: 'Please upload media file or supply URL' });
    }

    const lastGallery = await queryOne('SELECT MAX(item_order) as maxOrder FROM gallery');
    const nextOrder = lastGallery && lastGallery.maxOrder !== null ? lastGallery.maxOrder + 1 : 0;

    console.log('Inserting gallery item with order:', nextOrder, 'title:', data.title || 'Untitled', 'url:', data.mediaUrl);
    const result = await run(
      `INSERT INTO gallery (title, mediaUrl, mediaType, albumName, item_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.title || '',
        data.mediaUrl,
        data.mediaType,
        data.albumName,
        nextOrder
      ]
    );

    const mediaItem = await queryOne('SELECT * FROM gallery WHERE id = ?', [result.id]);
    mediaItem._id = mediaItem.id;
    mediaItem.url = mediaItem.mediaUrl;
    mediaItem.category = mediaItem.albumName;

    await logActivity(req.user.username, 'CREATE_GALLERY_ITEM', `Uploaded gallery item: ${mediaItem.title || 'Untitled'}`, req);

    res.status(201).json({ success: true, data: mediaItem });
  } catch (error) {
    next(error);
  }
};

export const deleteGalleryItem = async (req, res, next) => {
  try {
    const media = await queryOne('SELECT * FROM gallery WHERE id = ?', [req.params.id]);
    if (!media) {
      return res.status(404).json({ success: false, error: 'Gallery item not found' });
    }

    await run('DELETE FROM gallery WHERE id = ?', [req.params.id]);

    await logActivity(req.user.username, 'DELETE_GALLERY_ITEM', `Deleted gallery media: ${media.title || 'Untitled'}`, req);

    res.status(200).json({ success: true, message: 'Gallery media removed' });
  } catch (error) {
    next(error);
  }
};

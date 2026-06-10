import { queryOne, run, query, isPostgres } from '../config/sqliteDb.js';
import { handleFileUpload } from '../middleware/upload.js';
import { logActivity } from '../middleware/activityLogger.js';

// Helper to safely parse JSON or return default
const safeParse = (str, def = {}) => {
  try {
    return str ? JSON.parse(str) : def;
  } catch (e) {
    return def;
  }
};

// --- PROFILE ACTIONS ---

export const getProfile = async (req, res, next) => {
  try {
    let profile = await queryOne('SELECT * FROM profile LIMIT 1');
    if (!profile) {
      const result = await run('INSERT INTO profile (fullName) VALUES (?)', ['New User']);
      profile = await queryOne('SELECT * FROM profile WHERE id = ?', [result.id]);
    }
    
    // Parse JSON fields
    profile.socialLinks = safeParse(profile.socialLinks);
    profile.contactInfo = safeParse(profile.contactInfo);
    profile._id = profile.id;

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    let profile = await queryOne('SELECT * FROM profile LIMIT 1');
    if (!profile) {
      const result = await run('INSERT INTO profile (fullName) VALUES (?)', ['New User']);
      profile = await queryOne('SELECT * FROM profile WHERE id = ?', [result.id]);
    }

    const merged = {
      fullName: req.body.fullName !== undefined ? req.body.fullName : profile.fullName,
      nickname: req.body.nickname !== undefined ? req.body.nickname : profile.nickname,
      professionalTitle: req.body.professionalTitle !== undefined ? req.body.professionalTitle : profile.professionalTitle,
      shortIntro: req.body.shortIntro !== undefined ? req.body.shortIntro : profile.shortIntro,
      statusBadge: req.body.statusBadge !== undefined ? req.body.statusBadge : profile.statusBadge,
      profileImage: req.body.profileImage !== undefined ? req.body.profileImage : (req.body.avatarImage !== undefined ? req.body.avatarImage : profile.profileImage),
      age: req.body.age !== undefined ? parseInt(req.body.age) : profile.age,
      dob: req.body.dob !== undefined ? req.body.dob : profile.dob,
      gender: req.body.gender !== undefined ? req.body.gender : profile.gender,
      height: req.body.height !== undefined ? req.body.height : profile.height,
      weight: req.body.weight !== undefined ? req.body.weight : profile.weight,
      bloodGroup: req.body.bloodGroup !== undefined ? req.body.bloodGroup : profile.bloodGroup,
      maritalStatus: req.body.maritalStatus !== undefined ? req.body.maritalStatus : profile.maritalStatus,
      motherTongue: req.body.motherTongue !== undefined ? req.body.motherTongue : profile.motherTongue,
      religion: req.body.religion !== undefined ? req.body.religion : profile.religion,
      location: req.body.location !== undefined ? req.body.location : profile.location,
      socialLinks: req.body.socialLinks !== undefined ? (typeof req.body.socialLinks === 'string' ? req.body.socialLinks : JSON.stringify(req.body.socialLinks)) : profile.socialLinks,
      contactInfo: req.body.contactInfo !== undefined ? (typeof req.body.contactInfo === 'string' ? req.body.contactInfo : JSON.stringify(req.body.contactInfo)) : profile.contactInfo
    };

    if (req.file) {
      merged.profileImage = await handleFileUpload(req.file);
    }

    await run(
      `UPDATE profile SET 
        fullName = ?, nickname = ?, professionalTitle = ?, shortIntro = ?, statusBadge = ?, profileImage = ?,
        age = ?, dob = ?, gender = ?, height = ?, weight = ?, bloodGroup = ?, maritalStatus = ?, motherTongue = ?,
        religion = ?, location = ?, socialLinks = ?, contactInfo = ?
       WHERE id = ?`,
      [
        merged.fullName, merged.nickname, merged.professionalTitle, merged.shortIntro, merged.statusBadge, merged.profileImage,
        merged.age, merged.dob, merged.gender, merged.height, merged.weight, merged.bloodGroup, merged.maritalStatus, merged.motherTongue,
        merged.religion, merged.location, merged.socialLinks, merged.contactInfo,
        profile.id
      ]
    );

    const updatedProfile = await queryOne('SELECT * FROM profile WHERE id = ?', [profile.id]);
    updatedProfile.socialLinks = safeParse(updatedProfile.socialLinks);
    updatedProfile.contactInfo = safeParse(updatedProfile.contactInfo);
    updatedProfile._id = updatedProfile.id;

    await logActivity(req.user?.username || 'System', 'UPDATE_PROFILE', 'Updated profile & personal info details', req);

    res.status(200).json({ success: true, data: updatedProfile });
  } catch (error) {
    next(error);
  }
};

// --- FAMILY ACTIONS ---

export const getFamily = async (req, res, next) => {
  try {
    let family = await queryOne('SELECT * FROM family LIMIT 1');
    if (!family) {
      const result = await run('INSERT INTO family (familyType) VALUES (?)', ['Nuclear']);
      family = await queryOne('SELECT * FROM family WHERE id = ?', [result.id]);
    }

    family.fatherDetails = safeParse(family.fatherDetails);
    family.motherDetails = safeParse(family.motherDetails);
    family.brothers = safeParse(family.brothers, []);
    family.sisters = safeParse(family.sisters, []);
    
    // Normalize brothers & sisters into combined siblings list for frontend compatibility
    const brothersList = Array.isArray(family.brothers) ? family.brothers : [];
    const sistersList = Array.isArray(family.sisters) ? family.sisters : [];
    family.siblings = [
      ...brothersList.map(b => ({ ...b, role: b.role || 'Brother' })),
      ...sistersList.map(s => ({ ...s, role: s.role || 'Sister' }))
    ];
    family.backgroundText = family.familyBackground || '';
    family._id = family.id;

    res.status(200).json({ success: true, data: family });
  } catch (error) {
    next(error);
  }
};

export const updateFamily = async (req, res, next) => {
  try {
    let family = await queryOne('SELECT * FROM family LIMIT 1');
    if (!family) {
      const result = await run('INSERT INTO family (familyType) VALUES (?)', ['Nuclear']);
      family = await queryOne('SELECT * FROM family WHERE id = ?', [result.id]);
    }

    const fatherDetails = req.body.fatherDetails !== undefined ? JSON.stringify(req.body.fatherDetails) : family.fatherDetails;
    const motherDetails = req.body.motherDetails !== undefined ? JSON.stringify(req.body.motherDetails) : family.motherDetails;
    const familyType = req.body.familyType !== undefined ? req.body.familyType : family.familyType;
    const familyBackground = req.body.backgroundText !== undefined ? req.body.backgroundText : (req.body.familyBackground !== undefined ? req.body.familyBackground : family.familyBackground);

    // Map combined siblings list back to separate brothers/sisters database columns
    let brothers = family.brothers;
    let sisters = family.sisters;
    if (req.body.siblings !== undefined && Array.isArray(req.body.siblings)) {
      const bList = [];
      const sList = [];
      req.body.siblings.forEach(sib => {
        const roleLower = (sib.role || '').toLowerCase();
        if (roleLower.includes('brother')) {
          bList.push(sib);
        } else {
          sList.push(sib);
        }
      });
      brothers = JSON.stringify(bList);
      sisters = JSON.stringify(sList);
    } else {
      brothers = req.body.brothers !== undefined ? JSON.stringify(req.body.brothers) : family.brothers;
      sisters = req.body.sisters !== undefined ? JSON.stringify(req.body.sisters) : family.sisters;
    }

    await run(
      `UPDATE family SET fatherDetails = ?, motherDetails = ?, brothers = ?, sisters = ?, familyType = ?, familyBackground = ? WHERE id = ?`,
      [fatherDetails, motherDetails, brothers, sisters, familyType, familyBackground, family.id]
    );

    const updatedFamily = await queryOne('SELECT * FROM family WHERE id = ?', [family.id]);
    updatedFamily.fatherDetails = safeParse(updatedFamily.fatherDetails);
    updatedFamily.motherDetails = safeParse(updatedFamily.motherDetails);
    updatedFamily.brothers = safeParse(updatedFamily.brothers, []);
    updatedFamily.sisters = safeParse(updatedFamily.sisters, []);
    
    // Re-normalize for the final response
    const updatedBList = Array.isArray(updatedFamily.brothers) ? updatedFamily.brothers : [];
    const updatedSList = Array.isArray(updatedFamily.sisters) ? updatedFamily.sisters : [];
    updatedFamily.siblings = [
      ...updatedBList.map(b => ({ ...b, role: b.role || 'Brother' })),
      ...updatedSList.map(s => ({ ...s, role: s.role || 'Sister' }))
    ];
    updatedFamily.backgroundText = updatedFamily.familyBackground || '';
    updatedFamily._id = updatedFamily.id;

    await logActivity(req.user?.username || 'System', 'UPDATE_FAMILY', 'Updated family profile details', req);

    res.status(200).json({ success: true, data: updatedFamily });
  } catch (error) {
    next(error);
  }
};

// --- EDUCATION & CAREER ACTIONS ---

export const getEducationCareer = async (req, res, next) => {
  try {
    let edCar = await queryOne('SELECT * FROM education_career LIMIT 1');
    if (!edCar) {
      const result = await run(
        'INSERT INTO education_career (education, experience, skills, certifications, futureGoals) VALUES (?, ?, ?, ?, ?)',
        ['[]', '[]', '[]', '[]', '[]']
      );
      edCar = await queryOne('SELECT * FROM education_career WHERE id = ?', [result.id]);
    }

    edCar.education = safeParse(edCar.education, []);
    edCar.experience = safeParse(edCar.experience, []);
    edCar.skills = safeParse(edCar.skills, []);
    edCar.certifications = safeParse(edCar.certifications, []);
    edCar.futureGoals = safeParse(edCar.futureGoals, []);
    edCar._id = edCar.id;

    res.status(200).json({ success: true, data: edCar });
  } catch (error) {
    next(error);
  }
};

export const updateEducationCareer = async (req, res, next) => {
  try {
    let edCar = await queryOne('SELECT * FROM education_career LIMIT 1');
    if (!edCar) {
      const result = await run(
        'INSERT INTO education_career (education, experience, skills, certifications, futureGoals) VALUES (?, ?, ?, ?, ?)',
        ['[]', '[]', '[]', '[]', '[]']
      );
      edCar = await queryOne('SELECT * FROM education_career WHERE id = ?', [result.id]);
    }

    const education = req.body.education !== undefined ? JSON.stringify(req.body.education) : edCar.education;
    const experience = req.body.experience !== undefined ? JSON.stringify(req.body.experience) : edCar.experience;
    const skills = req.body.skills !== undefined ? JSON.stringify(req.body.skills) : edCar.skills;
    const certifications = req.body.certifications !== undefined ? JSON.stringify(req.body.certifications) : edCar.certifications;
    const futureGoals = req.body.futureGoals !== undefined ? JSON.stringify(req.body.futureGoals) : edCar.futureGoals;

    await run(
      `UPDATE education_career SET education = ?, experience = ?, skills = ?, certifications = ?, futureGoals = ? WHERE id = ?`,
      [education, experience, skills, certifications, futureGoals, edCar.id]
    );

    const updatedEdCar = await queryOne('SELECT * FROM education_career WHERE id = ?', [edCar.id]);
    updatedEdCar.education = safeParse(updatedEdCar.education, []);
    updatedEdCar.experience = safeParse(updatedEdCar.experience, []);
    updatedEdCar.skills = safeParse(updatedEdCar.skills, []);
    updatedEdCar.certifications = safeParse(updatedEdCar.certifications, []);
    updatedEdCar.futureGoals = safeParse(updatedEdCar.futureGoals, []);
    updatedEdCar._id = updatedEdCar.id;

    await logActivity(req.user?.username || 'System', 'UPDATE_EDUCATION_CAREER', 'Updated education/career timeline details', req);

    res.status(200).json({ success: true, data: updatedEdCar });
  } catch (error) {
    next(error);
  }
};

// --- LIFESTYLE ACTIONS ---

export const getLifestyle = async (req, res, next) => {
  try {
    let lifestyle = await queryOne('SELECT * FROM lifestyle LIMIT 1');
    if (!lifestyle) {
      const result = await run(
        'INSERT INTO lifestyle (hobbies, interests, fitness, travel, languages) VALUES (?, ?, ?, ?, ?)',
        ['[]', '[]', '', '[]', '[]']
      );
      lifestyle = await queryOne('SELECT * FROM lifestyle WHERE id = ?', [result.id]);
    }

    lifestyle.hobbies = safeParse(lifestyle.hobbies, []);
    lifestyle.interests = safeParse(lifestyle.interests, []);
    lifestyle.travel = safeParse(lifestyle.travel, []);
    lifestyle.languages = safeParse(lifestyle.languages, []);
    lifestyle._id = lifestyle.id;

    res.status(200).json({ success: true, data: lifestyle });
  } catch (error) {
    next(error);
  }
};

export const updateLifestyle = async (req, res, next) => {
  try {
    let lifestyle = await queryOne('SELECT * FROM lifestyle LIMIT 1');
    if (!lifestyle) {
      const result = await run(
        'INSERT INTO lifestyle (hobbies, interests, fitness, travel, languages) VALUES (?, ?, ?, ?, ?)',
        ['[]', '[]', '', '[]', '[]']
      );
      lifestyle = await queryOne('SELECT * FROM lifestyle WHERE id = ?', [result.id]);
    }

    const hobbies = req.body.hobbies !== undefined ? JSON.stringify(req.body.hobbies) : lifestyle.hobbies;
    const interests = req.body.interests !== undefined ? JSON.stringify(req.body.interests) : lifestyle.interests;
    const fitness = req.body.fitness !== undefined ? req.body.fitness : lifestyle.fitness;
    const travel = req.body.travel !== undefined ? JSON.stringify(req.body.travel) : lifestyle.travel;
    const languages = req.body.languages !== undefined ? JSON.stringify(req.body.languages) : lifestyle.languages;

    await run(
      `UPDATE lifestyle SET hobbies = ?, interests = ?, fitness = ?, travel = ?, languages = ? WHERE id = ?`,
      [hobbies, interests, fitness, travel, languages, lifestyle.id]
    );

    const updatedLifestyle = await queryOne('SELECT * FROM lifestyle WHERE id = ?', [lifestyle.id]);
    updatedLifestyle.hobbies = safeParse(updatedLifestyle.hobbies, []);
    updatedLifestyle.interests = safeParse(updatedLifestyle.interests, []);
    updatedLifestyle.travel = safeParse(updatedLifestyle.travel, []);
    updatedLifestyle.languages = safeParse(updatedLifestyle.languages, []);
    updatedLifestyle._id = updatedLifestyle.id;

    await logActivity(req.user?.username || 'System', 'UPDATE_LIFESTYLE', 'Updated lifestyle hobbies & interest options', req);

    res.status(200).json({ success: true, data: updatedLifestyle });
  } catch (error) {
    next(error);
  }
};

// --- SETTINGS ACTIONS ---

export const getSettings = async (req, res, next) => {
  try {
    let settings = await queryOne('SELECT * FROM settings LIMIT 1');
    if (!settings) {
      const result = await run(
        'INSERT INTO settings (theme, seo, sectionOrder, sectionVisibility) VALUES (?, ?, ?, ?)',
        [
          JSON.stringify({ primaryColor: '#FFFFFF', accentColor: '#D4AF37', isDarkMode: false, fontFamily: 'Inter' }),
          JSON.stringify({ metaTitle: 'My Digital Biodata', metaDescription: 'Digital CV', keywords: 'biodata', ogImage: '' }),
          JSON.stringify(['hero', 'personal', 'family', 'education', 'career', 'projects', 'achievements', 'gallery', 'lifestyle', 'contact']),
          JSON.stringify({ hero: true, about: true, education: true, experience: true, skills: true, projects: true, certifications: true, family: true, hobbies: true, gallery: true, contact: true })
        ]
      );
      settings = await queryOne('SELECT * FROM settings WHERE id = ?', [result.id]);
    }

    settings.theme = safeParse(settings.theme);
    settings.seo = safeParse(settings.seo);
    settings.sectionOrder = safeParse(settings.sectionOrder, []);
    settings.sectionVisibility = safeParse(settings.sectionVisibility, {
      hero: true, about: true, education: true, experience: true, skills: true, projects: true, certifications: true, family: true, hobbies: true, gallery: true, contact: true
    });
    settings._id = settings.id;

    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req, res, next) => {
  try {
    let settings = await queryOne('SELECT * FROM settings LIMIT 1');
    if (!settings) {
      const result = await run(
        'INSERT INTO settings (theme, seo, sectionOrder, sectionVisibility) VALUES (?, ?, ?, ?)',
        [
          JSON.stringify({ primaryColor: '#FFFFFF', accentColor: '#D4AF37', isDarkMode: false, fontFamily: 'Inter' }),
          JSON.stringify({ metaTitle: 'My Digital Biodata', metaDescription: 'Digital CV', keywords: 'biodata', ogImage: '' }),
          JSON.stringify(['hero', 'personal', 'family', 'education', 'career', 'projects', 'achievements', 'gallery', 'lifestyle', 'contact']),
          JSON.stringify({ hero: true, about: true, education: true, experience: true, skills: true, projects: true, certifications: true, family: true, hobbies: true, gallery: true, contact: true })
        ]
      );
      settings = await queryOne('SELECT * FROM settings WHERE id = ?', [result.id]);
    }

    const theme = req.body.theme !== undefined ? JSON.stringify(req.body.theme) : settings.theme;
    const seo = req.body.seo !== undefined ? JSON.stringify(req.body.seo) : settings.seo;
    const sectionOrder = req.body.sectionOrder !== undefined ? JSON.stringify(req.body.sectionOrder) : settings.sectionOrder;
    const sectionVisibility = req.body.sectionVisibility !== undefined ? JSON.stringify(req.body.sectionVisibility) : settings.sectionVisibility;

    await run(
      `UPDATE settings SET theme = ?, seo = ?, sectionOrder = ?, sectionVisibility = ? WHERE id = ?`,
      [theme, seo, sectionOrder, sectionVisibility, settings.id]
    );

    const updatedSettings = await queryOne('SELECT * FROM settings WHERE id = ?', [settings.id]);
    updatedSettings.theme = safeParse(updatedSettings.theme);
    updatedSettings.seo = safeParse(updatedSettings.seo);
    updatedSettings.sectionOrder = safeParse(updatedSettings.sectionOrder, []);
    updatedSettings.sectionVisibility = safeParse(updatedSettings.sectionVisibility, {
      hero: true, about: true, education: true, experience: true, skills: true, projects: true, certifications: true, family: true, hobbies: true, gallery: true, contact: true
    });
    updatedSettings._id = updatedSettings.id;

    await logActivity(req.user?.username || 'System', 'UPDATE_SETTINGS', 'Updated system layout theme & SEO keywords', req);

    res.status(200).json({ success: true, data: updatedSettings });
  } catch (error) {
    next(error);
  }
};

// --- BACKUP / EXPORT & IMPORT ACTIONS ---

export const exportBackup = async (req, res, next) => {
  try {
    // Export structure from tables
    const profile = await queryOne('SELECT * FROM profile LIMIT 1');
    if (profile) {
      profile.socialLinks = safeParse(profile.socialLinks);
      profile.contactInfo = safeParse(profile.contactInfo);
      profile._id = profile.id;
    }

    const family = await queryOne('SELECT * FROM family LIMIT 1');
    if (family) {
      family.fatherDetails = safeParse(family.fatherDetails);
      family.motherDetails = safeParse(family.motherDetails);
      family.brothers = safeParse(family.brothers, []);
      family.sisters = safeParse(family.sisters, []);
      family._id = family.id;
    }

    const educationCareer = await queryOne('SELECT * FROM education_career LIMIT 1');
    if (educationCareer) {
      educationCareer.education = safeParse(educationCareer.education, []);
      educationCareer.experience = safeParse(educationCareer.experience, []);
      educationCareer.skills = safeParse(educationCareer.skills, []);
      educationCareer.certifications = safeParse(educationCareer.certifications, []);
      educationCareer.futureGoals = safeParse(educationCareer.futureGoals, []);
      educationCareer._id = educationCareer.id;
    }

    const lifestyle = await queryOne('SELECT * FROM lifestyle LIMIT 1');
    if (lifestyle) {
      lifestyle.hobbies = safeParse(lifestyle.hobbies, []);
      lifestyle.interests = safeParse(lifestyle.interests, []);
      lifestyle.travel = safeParse(lifestyle.travel, []);
      lifestyle.languages = safeParse(lifestyle.languages, []);
      lifestyle._id = lifestyle.id;
    }

    const settings = await queryOne('SELECT * FROM settings LIMIT 1');
    if (settings) {
      settings.theme = safeParse(settings.theme);
      settings.seo = safeParse(settings.seo);
      settings.sectionOrder = safeParse(settings.sectionOrder, []);
      settings.sectionVisibility = safeParse(settings.sectionVisibility, {
        hero: true, about: true, education: true, experience: true, skills: true, projects: true, certifications: true, family: true, hobbies: true, gallery: true, contact: true
      });
      settings._id = settings.id;
    }

    const projects = (await query('SELECT * FROM projects ORDER BY item_order ASC')).map(p => ({ ...p, _id: p.id }));
    const achievements = (await query('SELECT * FROM achievements ORDER BY date DESC')).map(a => ({ ...a, _id: a.id }));
    const gallery = (await query('SELECT * FROM gallery ORDER BY item_order ASC')).map(g => ({ ...g, _id: g.id }));

    const backupData = {
      profile,
      family,
      educationCareer,
      lifestyle,
      settings,
      projects,
      achievements,
      gallery
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

    // Restore Profile
    if (backup.profile) {
      await run('DELETE FROM profile');
      await run(
        `INSERT INTO profile (
          id, fullName, nickname, professionalTitle, shortIntro, statusBadge, profileImage,
          age, dob, gender, height, weight, bloodGroup, maritalStatus, motherTongue,
          religion, location, socialLinks, contactInfo
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          backup.profile.id || 1,
          backup.profile.fullName,
          backup.profile.nickname,
          backup.profile.professionalTitle,
          backup.profile.shortIntro,
          backup.profile.statusBadge,
          backup.profile.profileImage,
          backup.profile.age,
          backup.profile.dob,
          backup.profile.gender,
          backup.profile.height,
          backup.profile.weight,
          backup.profile.bloodGroup,
          backup.profile.maritalStatus,
          backup.profile.motherTongue,
          backup.profile.religion,
          backup.profile.location,
          JSON.stringify(backup.profile.socialLinks || {}),
          JSON.stringify(backup.profile.contactInfo || {})
        ]
      );
    }

    // Restore Family
    if (backup.family) {
      await run('DELETE FROM family');
      await run(
        `INSERT INTO family (id, fatherDetails, motherDetails, brothers, sisters, familyType, familyBackground)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          backup.family.id || 1,
          JSON.stringify(backup.family.fatherDetails || {}),
          JSON.stringify(backup.family.motherDetails || {}),
          JSON.stringify(backup.family.brothers || []),
          JSON.stringify(backup.family.sisters || []),
          backup.family.familyType,
          backup.family.familyBackground
        ]
      );
    }

    // Restore Education & Career
    if (backup.educationCareer) {
      await run('DELETE FROM education_career');
      await run(
        `INSERT INTO education_career (id, education, experience, skills, certifications, futureGoals)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          backup.educationCareer.id || 1,
          JSON.stringify(backup.educationCareer.education || []),
          JSON.stringify(backup.educationCareer.experience || []),
          JSON.stringify(backup.educationCareer.skills || []),
          JSON.stringify(backup.educationCareer.certifications || []),
          JSON.stringify(backup.educationCareer.futureGoals || [])
        ]
      );
    }

    // Restore Lifestyle
    if (backup.lifestyle) {
      await run('DELETE FROM lifestyle');
      await run(
        `INSERT INTO lifestyle (id, hobbies, interests, fitness, travel, languages)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          backup.lifestyle.id || 1,
          JSON.stringify(backup.lifestyle.hobbies || []),
          JSON.stringify(backup.lifestyle.interests || []),
          backup.lifestyle.fitness,
          JSON.stringify(backup.lifestyle.travel || []),
          JSON.stringify(backup.lifestyle.languages || [])
        ]
      );
    }

    // Restore Settings
    if (backup.settings) {
      await run('DELETE FROM settings');
      await run(
        `INSERT INTO settings (id, theme, seo, sectionOrder, sectionVisibility) VALUES (?, ?, ?, ?, ?)`,
        [
          backup.settings.id || 1,
          JSON.stringify(backup.settings.theme || {}),
          JSON.stringify(backup.settings.seo || {}),
          JSON.stringify(backup.settings.sectionOrder || []),
          JSON.stringify(backup.settings.sectionVisibility || {})
        ]
      );
    }

    // Restore Projects
    if (backup.projects && Array.isArray(backup.projects)) {
      await run('DELETE FROM projects');
      for (const p of backup.projects) {
        await run(
          `INSERT INTO projects (id, title, description, image, tags, githubLink, demoLink, item_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [p.id || p._id, p.title, p.description, p.image, typeof p.tags === 'string' ? p.tags : JSON.stringify(p.tags || []), p.githubLink, p.demoLink, p.item_order]
        );
      }
    }

    // Restore Achievements
    if (backup.achievements && Array.isArray(backup.achievements)) {
      await run('DELETE FROM achievements');
      for (const a of backup.achievements) {
        await run(
          `INSERT INTO achievements (id, title, description, category, date, documentUrl)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [a.id || a._id, a.title, a.description, a.category, a.date, a.documentUrl]
        );
      }
    }

    // Restore Gallery
    if (backup.gallery && Array.isArray(backup.gallery)) {
      await run('DELETE FROM gallery');
      for (const g of backup.gallery) {
        await run(
          `INSERT INTO gallery (id, title, mediaUrl, mediaType, albumName, item_order)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [g.id || g._id, g.title, g.mediaUrl, g.mediaType, g.albumName, g.item_order]
        );
      }
    }

    if (isPostgres()) {
      const tables = ['profile', 'family', 'education_career', 'lifestyle', 'settings', 'projects', 'achievements', 'gallery'];
      for (const t of tables) {
        await query(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), COALESCE(max(id), 1)) FROM ${t}`);
      }
    }

    await logActivity(req.user.username, 'RESTORE_BACKUP', 'Successfully restored database from file backup', req);

    res.status(200).json({ success: true, message: 'Database backup imported successfully' });
  } catch (error) {
    next(error);
  }
};

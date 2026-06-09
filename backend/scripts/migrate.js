import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec, run, queryOne } from '../config/sqliteDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedSourcePath = 'C:/Users/kirtan/.gemini/antigravity/brain/bc7805f9-3cd4-425b-bffb-2869cbaed21b/scratch/extracted_data.json';

const schema = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  email TEXT UNIQUE,
  password_hash TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fullName TEXT,
  nickname TEXT,
  professionalTitle TEXT,
  shortIntro TEXT,
  statusBadge TEXT,
  profileImage TEXT,
  age INTEGER,
  dob TEXT,
  gender TEXT,
  height TEXT,
  weight TEXT,
  bloodGroup TEXT,
  maritalStatus TEXT,
  motherTongue TEXT,
  religion TEXT,
  location TEXT,
  socialLinks TEXT,
  contactInfo TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS family (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fatherDetails TEXT,
  motherDetails TEXT,
  brothers TEXT,
  sisters TEXT,
  familyType TEXT,
  familyBackground TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS education_career (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  education TEXT,
  experience TEXT,
  skills TEXT,
  certifications TEXT,
  futureGoals TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS lifestyle (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  hobbies TEXT,
  interests TEXT,
  fitness TEXT,
  travel TEXT,
  languages TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  image TEXT,
  tags TEXT,
  githubLink TEXT,
  demoLink TEXT,
  item_order INTEGER,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  description TEXT,
  category TEXT,
  date TEXT,
  documentUrl TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  mediaUrl TEXT,
  mediaType TEXT,
  albumName TEXT,
  item_order INTEGER,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  theme TEXT,
  seo TEXT,
  sectionOrder TEXT,
  sectionVisibility TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  subject TEXT,
  message TEXT,
  status TEXT DEFAULT 'unread',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT,
  ip TEXT,
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT,
  action TEXT,
  details TEXT,
  ip TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

export const runMigration = async () => {
  try {
    console.log('Running database migrations...');
    await exec(schema);
    console.log('Database tables created successfully.');

    // 1. Seed admin user if it doesn't exist
    const adminExists = await queryOne('SELECT * FROM users WHERE username = ?', ['admin']);
    if (!adminExists) {
      const passwordHash = await bcrypt.hash('adminpassword123', 10);
      await run(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        ['admin', 'admin@example.com', passwordHash]
      );
      console.log('Seeded default admin user (username: admin, password: adminpassword123)');
    }

    // 2. Seed portfolio data from extracted JSON if table is empty
    const profileExists = await queryOne('SELECT * FROM profile LIMIT 1');
    if (!profileExists) {
      if (fs.existsSync(seedSourcePath)) {
        console.log('Reading extracted seed data from:', seedSourcePath);
        const seedData = JSON.parse(fs.readFileSync(seedSourcePath, 'utf8'));

        // Seed Profile
        const personal = seedData.personal || {};
        const about = seedData.about || {};
        const contact = seedData.contact || {};
        await run(
          `INSERT INTO profile (
            fullName, nickname, professionalTitle, shortIntro, statusBadge, profileImage,
            age, dob, gender, height, weight, bloodGroup, maritalStatus, motherTongue,
            religion, location, socialLinks, contactInfo
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            personal.fullName || 'Kirtan Vaja',
            personal.nickname || '',
            personal.professionalTitle || '',
            personal.shortIntro || about.biography || '',
            personal.statusBadge || '',
            personal.avatarImage || '',
            personal.age || 19,
            personal.dob || '',
            personal.gender || '',
            personal.height || '',
            personal.weight || '',
            personal.bloodGroup || '',
            personal.maritalStatus || '',
            personal.motherTongue || '',
            personal.religion || '',
            personal.location || '',
            JSON.stringify(personal.socialLinks || {}),
            JSON.stringify(contact || {})
          ]
        );

        // Seed Family
        const familyData = seedData.family || {};
        // Map sibling details to brothers/sisters lists
        const brothers = [];
        const sisters = [];
        if (familyData.siblings && Array.isArray(familyData.siblings)) {
          familyData.siblings.forEach(sib => {
            const item = { name: sib.name, occupation: sib.occupation, maritalStatus: sib.maritalStatus };
            if (sib.role && sib.role.toLowerCase().includes('brother')) {
              brothers.push(item);
            } else {
              sisters.push(item);
            }
          });
        }
        await run(
          `INSERT INTO family (fatherDetails, motherDetails, brothers, sisters, familyType, familyBackground)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            JSON.stringify(familyData.fatherDetails || {}),
            JSON.stringify(familyData.motherDetails || {}),
            JSON.stringify(brothers),
            JSON.stringify(sisters),
            familyData.familyType || 'Nuclear',
            familyData.backgroundText || ''
          ]
        );

        // Seed Education & Career
        const edCareer = {
          education: seedData.education || [],
          experience: seedData.experience || [],
          skills: seedData.skills || [],
          certifications: seedData.certifications || [],
          futureGoals: about.careerGoals || []
        };
        // Normalize education field startYear/endYear
        const normalizedEdu = edCareer.education.map(edu => {
          const years = edu.duration ? edu.duration.split('-').map(y => y.trim()) : ['', ''];
          return {
            school: edu.school,
            degree: edu.degree,
            stream: edu.stream || '',
            startYear: years[0] || '',
            endYear: years[1] || '',
            percentageOrCgpa: edu.percentageOrCgpa,
            achievements: edu.achievements
          };
        });
        // Normalize skills categories to Frontend/Backend/Cloud/Soft
        const normalizedSkills = edCareer.skills.map(s => {
          let lvl = 'Intermediate';
          if (s.levelPercent && s.levelPercent >= 90) lvl = 'Expert';
          else if (s.levelPercent && s.levelPercent < 60) lvl = 'Beginner';
          return {
            name: s.name,
            level: lvl,
            category: s.category || 'Technical'
          };
        });
        await run(
          `INSERT INTO education_career (education, experience, skills, certifications, futureGoals)
           VALUES (?, ?, ?, ?, ?)`,
          [
            JSON.stringify(normalizedEdu),
            JSON.stringify(edCareer.experience),
            JSON.stringify(normalizedSkills),
            JSON.stringify(edCareer.certifications),
            JSON.stringify(edCareer.futureGoals)
          ]
        );

        // Seed Lifestyle
        const lifestyle = seedData.lifestyle || {};
        await run(
          `INSERT INTO lifestyle (hobbies, interests, fitness, travel, languages)
           VALUES (?, ?, ?, ?, ?)`,
          [
            JSON.stringify(lifestyle.hobbies || []),
            JSON.stringify([]),
            '',
            JSON.stringify([]),
            JSON.stringify(lifestyle.languages || [])
          ]
        );

        // Seed Projects
        if (seedData.projects && Array.isArray(seedData.projects)) {
          for (let i = 0; i < seedData.projects.length; i++) {
            const p = seedData.projects[i];
            await run(
              `INSERT INTO projects (title, description, image, tags, githubLink, demoLink, item_order)
               VALUES (?, ?, ?, ?, ?, ?, ?)`,
              [
                p.title,
                p.description,
                p.image,
                p.tags || '',
                p.githubLink || '',
                p.demoLink || '',
                i
              ]
            );
          }
        }

        // Seed Certifications as Achievements
        if (seedData.certifications && Array.isArray(seedData.certifications)) {
          for (const c of seedData.certifications) {
            await run(
              `INSERT INTO achievements (title, description, category, date, documentUrl)
               VALUES (?, ?, ?, ?, ?)`,
              [
                c.title,
                c.credentialId ? `Credential ID: ${c.credentialId}` : '',
                c.issuer || 'Certification',
                c.date || '',
                c.link || ''
              ]
            );
          }
        }

        // Seed Gallery
        if (seedData.gallery && Array.isArray(seedData.gallery)) {
          for (let i = 0; i < seedData.gallery.length; i++) {
            const g = seedData.gallery[i];
            await run(
              `INSERT INTO gallery (title, mediaUrl, mediaType, albumName, item_order)
               VALUES (?, ?, ?, ?, ?)`,
              [
                g.title || '',
                g.url || '',
                'image',
                g.category || 'General',
                i
              ]
            );
          }
        }

        // Seed Settings
        await run(
          `INSERT INTO settings (theme, seo, sectionOrder, sectionVisibility) VALUES (?, ?, ?, ?)`,
          [
            JSON.stringify({
              primaryColor: '#FFFFFF',
              accentColor: '#D4AF37',
              isDarkMode: false,
              fontFamily: 'Inter'
            }),
            JSON.stringify({
              metaTitle: 'My Digital Biodata & Portfolio',
              metaDescription: 'Welcome to my professional digital biodata, CV, and portfolio.',
              keywords: 'biodata, portfolio, resume, CV, developer, engineer',
              ogImage: ''
            }),
            JSON.stringify([
              'hero',
              'personal',
              'family',
              'education',
              'career',
              'projects',
              'achievements',
              'gallery',
              'lifestyle',
              'contact'
            ]),
            JSON.stringify({
              hero: true,
              about: true,
              education: true,
              experience: true,
              skills: true,
              projects: true,
              certifications: true,
              family: true,
              hobbies: true,
              gallery: true,
              contact: true
            })
          ]
        );

        console.log('Portfolio seed data imported from local storage backup successfully.');
      } else {
        console.warn('Seed data file not found at:', seedSourcePath);
      }
    }
  } catch (error) {
    console.error('Migration failed:', error.message);
    throw error;
  }
};

// Run directly if executed as main script
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runMigration().then(() => process.exit(0)).catch(() => process.exit(1));
}

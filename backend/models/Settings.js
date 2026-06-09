import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    theme: {
      primaryColor: { type: String, default: '#000000' },
      accentColor: { type: String, default: '#D4AF37' },
      isDarkMode: { type: Boolean, default: true },
      fontFamily: { type: String, default: 'Inter' },
    },
    seo: {
      metaTitle: { type: String, default: 'My Digital Biodata & Portfolio' },
      metaDescription: { type: String, default: 'Welcome to my professional digital biodata, CV, and portfolio.' },
      keywords: { type: String, default: 'biodata, portfolio, resume, CV, developer, engineer' },
      ogImage: { type: String, default: '' },
    },
    sectionOrder: {
      type: [String],
      default: [
        'hero',
        'personal',
        'family',
        'education',
        'career',
        'projects',
        'achievements',
        'gallery',
        'lifestyle',
        'contact',
      ],
    },
  },
  { timestamps: true }
);

const Settings = mongoose.model('Settings', settingsSchema);
export default Settings;

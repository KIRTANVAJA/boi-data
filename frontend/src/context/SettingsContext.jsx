import React, { createContext, useState, useEffect, useContext } from 'react';
import { apiRequest } from '../utils/api.js';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch settings on mount
  const fetchSettings = async () => {
    try {
      const res = await apiRequest('/profile/settings');
      if (res.success) {
        setSettings(res.data);
        applyTheme(res.data.theme);
        applySeo(res.data.seo);
      }
    } catch (err) {
      console.error('Failed to fetch configurations:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // Theme application helper
  const applyTheme = (theme) => {
    if (!theme) return;
    const root = document.documentElement;

    // Apply primary color
    root.style.setProperty('--bg-primary', theme.primaryColor || '#000000');
    
    // Apply font family
    if (theme.fontFamily) {
      root.style.setProperty('--font-title', `'${theme.fontFamily}', 'Inter', sans-serif`);
    }

    // Toggle body theme-mode classes
    if (theme.isDarkMode === false) {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  };

  // SEO application helper
  const applySeo = (seo) => {
    if (!seo) return;
    document.title = seo.metaTitle || 'Personal Digital Biodata & Portfolio';

    // Update Meta Description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = seo.metaDescription || '';

    // Update Meta Keywords
    let metaKeywords = document.querySelector("meta[name='keywords']");
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = seo.keywords || '';
  };

  // Save settings update
  const saveSettings = async (newSettings) => {
    try {
      const res = await apiRequest('/profile/settings', {
        method: 'PUT',
        body: newSettings,
      });
      if (res.success) {
        setSettings(res.data);
        applyTheme(res.data.theme);
        applySeo(res.data.seo);
        return res;
      }
    } catch (err) {
      throw err;
    }
  };

  // Log visitor page view hits
  const trackView = async (pageName) => {
    try {
      await apiRequest('/request/analytics/view', {
        method: 'POST',
        body: { page: pageName || '/' },
      });
    } catch (err) {
      console.warn('Analytics logging bypassed:', err.message);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, saveSettings, fetchSettings, trackView }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);

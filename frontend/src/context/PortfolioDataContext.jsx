import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultData } from '../data/defaultData.js';

const PortfolioDataContext = createContext();

export const PortfolioDataProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(() => {
    const localDb = localStorage.getItem('biodata_portfolio_db');
    if (localDb) {
      try {
        const parsed = JSON.parse(localDb);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse local storage database', e);
      }
    }
    return defaultData;
  });

  // Sync to local storage whenever state updates
  useEffect(() => {
    localStorage.setItem('biodata_portfolio_db', JSON.stringify(portfolioData));
  }, [portfolioData]);

  // Update object section (e.g. personal, about, contact)
  const updateSection = (sectionKey, updatedContent) => {
    setPortfolioData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...updatedContent
      }
    }));
  };

  // Add item to a list section (e.g. education, projects)
  const addItem = (sectionKey, item) => {
    setPortfolioData((prev) => {
      const currentList = Array.isArray(prev[sectionKey]) ? prev[sectionKey] : [];
      return {
        ...prev,
        [sectionKey]: [...currentList, item]
      };
    });
  };

  // Update specific index item in a list section
  const updateItem = (sectionKey, index, updatedItem) => {
    setPortfolioData((prev) => {
      const currentList = Array.isArray(prev[sectionKey]) ? [...prev[sectionKey]] : [];
      if (index >= 0 && index < currentList.length) {
        currentList[index] = { ...currentList[index], ...updatedItem };
      }
      return {
        ...prev,
        [sectionKey]: currentList
      };
    });
  };

  // Delete specific index item in a list section
  const deleteItem = (sectionKey, index) => {
    setPortfolioData((prev) => {
      const currentList = Array.isArray(prev[sectionKey]) ? prev[sectionKey] : [];
      const updatedList = currentList.filter((_, idx) => idx !== index);
      return {
        ...prev,
        [sectionKey]: updatedList
      };
    });
  };

  // Restores all sections back to seed templates
  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to revert all changes back to defaults?')) {
      setPortfolioData(defaultData);
      localStorage.setItem('biodata_portfolio_db', JSON.stringify(defaultData));
      return true;
    }
    return false;
  };

  const [visibilitySettings, setVisibilitySettings] = useState(() => {
    const saved = localStorage.getItem('website_sections_visibility');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse section visibility settings', e);
      }
    }
    return {
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
    };
  });

  useEffect(() => {
    localStorage.setItem('website_sections_visibility', JSON.stringify(visibilitySettings));
  }, [visibilitySettings]);

  const toggleSectionVisibility = (sectionKey) => {
    setVisibilitySettings((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };

  const setAllVisibility = (visible) => {
    setVisibilitySettings((prev) => {
      const next = {};
      Object.keys(prev).forEach((key) => {
        next[key] = visible;
      });
      return next;
    });
  };

  return (
    <PortfolioDataContext.Provider value={{
      portfolioData,
      updateSection,
      addItem,
      updateItem,
      deleteItem,
      resetToDefault,
      visibilitySettings,
      toggleSectionVisibility,
      setAllVisibility
    }}>
      {children}
    </PortfolioDataContext.Provider>
  );
};

export const usePortfolioData = () => useContext(PortfolioDataContext);

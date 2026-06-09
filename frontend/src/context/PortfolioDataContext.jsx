import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest } from '../utils/api.js';

const PortfolioDataContext = createContext();

export const PortfolioDataProvider = ({ children }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [profileRes, familyRes, edCarRes, lifestyleRes, projectsRes, achievementsRes, galleryRes] = await Promise.all([
        apiRequest('/profile'),
        apiRequest('/profile/family'),
        apiRequest('/profile/education-career'),
        apiRequest('/profile/lifestyle'),
        apiRequest('/portfolio/projects'),
        apiRequest('/portfolio/achievements'),
        apiRequest('/portfolio/gallery'),
      ]);

      const profile = profileRes.data || {};
      const family = familyRes.data || {};
      const edCar = edCarRes.data || {};
      const lifestyle = lifestyleRes.data || {};
      const projects = projectsRes.data || [];
      const achievements = achievementsRes.data || [];
      const gallery = galleryRes.data || [];

      setPortfolioData({
        personal: {
          fullName: profile.fullName || '',
          nickname: profile.nickname || '',
          professionalTitle: profile.professionalTitle || '',
          shortIntro: profile.shortIntro || '',
          statusBadge: profile.statusBadge || '',
          avatarImage: profile.profileImage || '',
          age: profile.age || '',
          dob: profile.dob || '',
          gender: profile.gender || '',
          height: profile.height || '',
          weight: profile.weight || '',
          bloodGroup: profile.bloodGroup || '',
          maritalStatus: profile.maritalStatus || '',
          motherTongue: profile.motherTongue || '',
          religion: profile.religion || '',
          location: profile.location || '',
          socialLinks: profile.socialLinks || {},
          contactInfo: profile.contactInfo || {}
        },
        about: {
          biography: profile.shortIntro || '',
          careerGoals: edCar.futureGoals || []
        },
        education: edCar.education || [],
        experience: edCar.experience || [],
        skills: edCar.skills || [],
        projects: projects,
        certifications: achievements, // SQLite achievements map to frontend certifications
        family: family,
        lifestyle: {
          hobbies: lifestyle.hobbies || [],
          languages: lifestyle.languages || [],
          interests: lifestyle.interests || []
        },
        gallery: gallery,
        contact: profile.contactInfo || {}
      });
    } catch (err) {
      console.error('Failed to load portfolio context:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Update object section (e.g. personal, about, contact)
  const updateSection = async (sectionKey, updatedContent) => {
    try {
      if (sectionKey === 'personal' || sectionKey === 'contact') {
        const body = sectionKey === 'personal' ? updatedContent : { contactInfo: updatedContent };
        const res = await apiRequest('/profile', {
          method: 'PUT',
          body
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'about') {
        const bodyProfile = { shortIntro: updatedContent.biography };
        const bodyEdCar = { futureGoals: updatedContent.careerGoals };
        await Promise.all([
          apiRequest('/profile', { method: 'PUT', body: bodyProfile }),
          apiRequest('/profile/education-career', { method: 'PUT', body: bodyEdCar })
        ]);
        await loadData();
        return true;
      } else if (sectionKey === 'family') {
        const res = await apiRequest('/profile/family', {
          method: 'PUT',
          body: updatedContent
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'lifestyle') {
        const res = await apiRequest('/profile/lifestyle', {
          method: 'PUT',
          body: updatedContent
        });
        if (res.success) {
          await loadData();
          return true;
        }
      }
    } catch (e) {
      console.error('Update section error:', e.message);
    }
    return false;
  };

  // Add item to a list section (e.g. education, projects)
  const addItem = async (sectionKey, item) => {
    try {
      if (sectionKey === 'education' || sectionKey === 'experience' || sectionKey === 'skills') {
        const currentList = portfolioData[sectionKey] || [];
        const body = { [sectionKey]: [...currentList, item] };
        const res = await apiRequest('/profile/education-career', {
          method: 'PUT',
          body
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'projects') {
        const res = await apiRequest('/portfolio/projects', {
          method: 'POST',
          body: item
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'certifications') {
        const res = await apiRequest('/portfolio/achievements', {
          method: 'POST',
          body: item
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'gallery') {
        const res = await apiRequest('/portfolio/gallery', {
          method: 'POST',
          body: item
        });
        if (res.success) {
          await loadData();
          return true;
        }
      }
    } catch (e) {
      console.error('Add item error:', e.message);
    }
    return false;
  };

  // Update specific item in a list section
  const updateItem = async (sectionKey, index, updatedItem) => {
    try {
      if (sectionKey === 'education' || sectionKey === 'experience' || sectionKey === 'skills') {
        const currentList = [...(portfolioData[sectionKey] || [])];
        if (index >= 0 && index < currentList.length) {
          currentList[index] = { ...currentList[index], ...updatedItem };
          const body = { [sectionKey]: currentList };
          const res = await apiRequest('/profile/education-career', {
            method: 'PUT',
            body
          });
          if (res.success) {
            await loadData();
            return true;
          }
        }
      } else if (sectionKey === 'projects') {
        const item = portfolioData.projects[index];
        const res = await apiRequest(`/portfolio/projects/${item._id || item.id}`, {
          method: 'PUT',
          body: updatedItem
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'certifications') {
        const item = portfolioData.certifications[index];
        const res = await apiRequest(`/portfolio/achievements/${item._id || item.id}`, {
          method: 'PUT',
          body: updatedItem
        });
        if (res.success) {
          await loadData();
          return true;
        }
      }
    } catch (e) {
      console.error('Update item error:', e.message);
    }
    return false;
  };

  // Delete specific item in a list section
  const deleteItem = async (sectionKey, index) => {
    try {
      if (sectionKey === 'education' || sectionKey === 'experience' || sectionKey === 'skills') {
        const currentList = portfolioData[sectionKey] || [];
        const newList = currentList.filter((_, idx) => idx !== index);
        const body = { [sectionKey]: newList };
        const res = await apiRequest('/profile/education-career', {
          method: 'PUT',
          body
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'projects') {
        const item = portfolioData.projects[index];
        const res = await apiRequest(`/portfolio/projects/${item._id || item.id}`, {
          method: 'DELETE'
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'certifications') {
        const item = portfolioData.certifications[index];
        const res = await apiRequest(`/portfolio/achievements/${item._id || item.id}`, {
          method: 'DELETE'
        });
        if (res.success) {
          await loadData();
          return true;
        }
      } else if (sectionKey === 'gallery') {
        const item = portfolioData.gallery[index];
        const res = await apiRequest(`/portfolio/gallery/${item._id || item.id}`, {
          method: 'DELETE'
        });
        if (res.success) {
          await loadData();
          return true;
        }
      }
    } catch (e) {
      console.error('Delete item error:', e.message);
    }
    return false;
  };

  const resetToDefault = async () => {
    return true;
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
      loading,
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

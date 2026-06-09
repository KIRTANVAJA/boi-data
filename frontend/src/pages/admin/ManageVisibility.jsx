import React from 'react';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ManageVisibility = () => {
  const { visibilitySettings, toggleSectionVisibility, setAllVisibility } = usePortfolioData();

  const sectionsConfig = [
    { key: 'hero', label: 'Hero Section', desc: 'Main introduction, avatar, name, and designation' },
    { key: 'about', label: 'About & Goals', desc: 'Biography details, bio stats, and career ambitions' },
    { key: 'education', label: 'Education Timeline', desc: 'Schools, diplomas, degrees, and academic timelines' },
    { key: 'experience', label: 'Experience History', desc: 'Work history, roles, companies, and timelines' },
    { key: 'skills', label: 'Skills Panel', desc: 'Skills matrix, categorizations, and proficiency ratings' },
    { key: 'projects', label: 'Projects Showcase', desc: 'Portfolio cards, repositories, and demo urls' },
    { key: 'certifications', label: 'Certifications', desc: 'Professional awards, credential IDs, and validation links' },
    { key: 'family', label: 'Family Profile', desc: 'Parent descriptions, siblings, and family values' },
    { key: 'hobbies', label: 'Hobbies & Interests', desc: 'Interests, lifestyle tags, and spoken languages' },
    { key: 'gallery', label: 'Gallery Media', desc: 'Workspace photos, milestone snapshots, and travel albums' },
    { key: 'contact', label: 'Contact Information', desc: 'Mailing address, phone, email, and Google map embed' },
  ];

  const handleBulkSet = (visible) => {
    setAllVisibility(visible);
    toast.success(visible ? 'All sections enabled on public website!' : 'All sections hidden on public website!');
  };

  return (
    <div className="animate-fade-up">
      <div className="mb-4 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h2 className="fw-bold text-gold-gradient mb-1">Website Visibility</h2>
          <p className="text-muted small">Show or hide specific sections on your public-facing single page application</p>
        </div>
        
        {/* Bulk Action Buttons */}
        <div className="d-flex gap-2">
          <button 
            type="button" 
            onClick={() => handleBulkSet(true)} 
            className="btn btn-glass btn-sm d-flex align-items-center gap-2"
          >
            <FaEye /> Show All Sections
          </button>
          <button 
            type="button" 
            onClick={() => handleBulkSet(false)} 
            className="btn btn-gold btn-sm d-flex align-items-center gap-2"
          >
            <FaEyeSlash /> Hide All Sections
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h5 className="text-gold mb-4">Section Visibility Controls</h5>
        <p className="text-muted small mb-4">
          Unchecking a section will hide it from the public homepage and navigation links immediately. 
          All entered data remains securely stored and editable in your admin panel.
        </p>

        <div className="row g-3">
          {sectionsConfig.map((sec) => {
            const isVisible = !!(visibilitySettings && visibilitySettings[sec.key]);
            return (
              <div key={sec.key} className="col-12 col-md-6 col-lg-4">
                <div 
                  className={`p-3 rounded border transition-smooth h-100 d-flex flex-column justify-content-between ${
                    isVisible ? 'bg-light border-warning' : 'bg-transparent border-secondary'
                  }`}
                  style={{
                    backgroundColor: isVisible ? 'rgba(212, 175, 55, 0.04)' : 'transparent',
                    borderColor: isVisible ? 'var(--gold-primary) !important' : 'var(--glass-border) !important'
                  }}
                >
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <strong className={isVisible ? 'text-gold' : 'text-muted'}>{sec.label}</strong>
                      <span className={`badge ${isVisible ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                        {isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <p className="text-muted small mb-0">{sec.desc}</p>
                  </div>

                  <div className="form-check form-switch d-flex align-items-center justify-content-between p-0 m-0">
                    <span className="text-muted small">
                      {isVisible ? (
                        <span className="text-success d-flex align-items-center gap-1"><FaCheckCircle /> Online</span>
                      ) : (
                        <span className="text-danger d-flex align-items-center gap-1"><FaTimesCircle /> Offline</span>
                      )}
                    </span>
                    <input
                      className="form-check-input ms-0"
                      type="checkbox"
                      role="switch"
                      checked={isVisible}
                      onChange={() => toggleSectionVisibility(sec.key)}
                      style={{ cursor: 'pointer', transform: 'scale(1.2)' }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ManageVisibility;

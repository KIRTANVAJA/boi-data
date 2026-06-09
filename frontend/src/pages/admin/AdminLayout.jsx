import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { usePortfolioData } from '../../context/PortfolioDataContext.jsx';
import { toast } from 'react-toastify';
import {
  FaThLarge, FaUser, FaInfoCircle, FaGraduationCap, FaBriefcase, FaCode,
  FaFolder, FaAward, FaUsers, FaImage, FaPhone, FaSignOutAlt, FaGlobe, FaBars, FaTimes,
  FaEye, FaEyeSlash, FaHeart
} from 'react-icons/fa';

const AdminLayout = () => {
  const { logout } = useAdminAuth();
  const { portfolioData, visibilitySettings } = usePortfolioData();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: 'Overview Dashboard', path: '/admin', icon: <FaThLarge /> },
    { label: 'Website Visibility', path: '/admin/visibility', icon: <FaEye /> },
    { label: 'Hero Section', path: '/admin/hero', icon: <FaUser /> },
    { label: 'About & Goals', path: '/admin/about', icon: <FaInfoCircle /> },
    { label: 'Education Grid', path: '/admin/education', icon: <FaGraduationCap /> },
    { label: 'Experience History', path: '/admin/experience', icon: <FaBriefcase /> },
    { label: 'Skills Panel', path: '/admin/skills', icon: <FaCode /> },
    { label: 'Projects Showcase', path: '/admin/projects', icon: <FaFolder /> },
    { label: 'Certifications', path: '/admin/certifications', icon: <FaAward /> },
    { label: 'Family Profile', path: '/admin/family', icon: <FaUsers /> },
    { label: 'Gallery Media', path: '/admin/gallery', icon: <FaImage /> },
    { label: 'Hobbies & Interests', path: '/admin/hobbies', icon: <FaHeart /> },
    { label: 'Contact Settings', path: '/admin/contact', icon: <FaPhone /> },
  ];

  const handleLockAdmin = () => {
    logout();
    toast.info('Admin Mode Locked');
    navigate('/');
  };

  return (
    <div className="container-fluid p-0 min-vh-100 d-flex flex-column flex-md-row bg-black text-white">
      {/* Mobile Header */}
      <div className="d-md-none d-flex justify-content-between align-items-center bg-dark p-3 border-bottom border-secondary">
        <span className="fw-bold text-gold-gradient">CMS ADMIN</span>
        <button className="btn text-gold border-0 p-0" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar Panel */}
      <div
        className={`col-md-3 col-lg-2 admin-sidebar p-0 d-md-flex flex-column justify-content-between position-fixed position-md-sticky top-0 start-0 h-100 z-3 ${
          mobileOpen ? 'd-flex w-75' : 'd-none'
        }`}
        style={{ zIndex: 1050 }}
      >
        <div>
          <div className="p-4 border-bottom border-secondary d-flex justify-content-between align-items-center">
            <span className="fw-bold text-gold-gradient fs-5">CMS PANEL</span>
            <button className="btn text-white d-md-none p-0 border-0" onClick={() => setMobileOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="p-3 m-2 bg-dark rounded border border-secondary text-center">
            <div className="small text-muted mb-1">Editor Account</div>
            <strong className="text-gold text-truncate d-block">{portfolioData.personal.fullName}</strong>
          </div>

          <ul className="nav flex-column mt-3">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;

              // Map path to section key for visibility lookup
              const getSectionKey = (path) => {
                switch (path) {
                  case '/admin/hero': return 'hero';
                  case '/admin/about': return 'about';
                  case '/admin/education': return 'education';
                  case '/admin/experience': return 'experience';
                  case '/admin/skills': return 'skills';
                  case '/admin/projects': return 'projects';
                  case '/admin/certifications': return 'certifications';
                  case '/admin/family': return 'family';
                  case '/admin/gallery': return 'gallery';
                  case '/admin/hobbies': return 'hobbies';
                  case '/admin/contact': return 'contact';
                  default: return null;
                }
              };

              const sectionKey = getSectionKey(item.path);
              const isVisible = sectionKey && visibilitySettings ? !!visibilitySettings[sectionKey] : null;

              return (
                <li key={item.path} className="nav-item">
                  <Link
                    to={item.path}
                    className={`nav-link d-flex align-items-center justify-content-between gap-2 ${active ? 'active' : ''}`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <span className="text-gold">{item.icon}</span>
                      <span className="small text-truncate" style={{ maxWidth: '140px' }}>{item.label}</span>
                    </div>
                    {sectionKey && isVisible !== null && (
                      <div className="d-flex align-items-center gap-1 ms-auto" style={{ fontSize: '0.7rem' }}>
                        {isVisible ? (
                          <>
                            <FaEye className="text-success" title="Visible on site" />
                            <span className="text-success font-monospace d-none d-lg-inline" style={{ fontSize: '0.62rem' }}>Visible</span>
                          </>
                        ) : (
                          <>
                            <FaEyeSlash className="text-danger" title="Hidden on site" />
                            <span className="text-danger font-monospace d-none d-lg-inline" style={{ fontSize: '0.62rem' }}>Hidden</span>
                          </>
                        )}
                      </div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-3 border-top border-secondary">
          <Link to="/" className="btn btn-glass btn-sm w-100 mb-2 d-flex align-items-center justify-content-center gap-2">
            <FaGlobe className="text-gold" />
            <span>View Live Site</span>
          </Link>
          <button onClick={handleLockAdmin} className="btn btn-gold btn-sm w-100 d-flex align-items-center justify-content-center gap-2">
            <FaSignOutAlt />
            <span>Lock Admin Mode</span>
          </button>
        </div>
      </div>

      {/* Main CMS Screen */}
      <div
        className="col-md-9 offset-md-3 col-lg-10 offset-lg-2 p-4 p-md-5 d-flex flex-column flex-grow-1"
        style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}
      >
        <div className="flex-grow-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

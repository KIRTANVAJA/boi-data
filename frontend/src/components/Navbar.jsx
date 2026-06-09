import React, { useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext.jsx';
import { FaUser, FaGraduationCap, FaCode, FaFolderOpen, FaHeart, FaImage, FaEnvelope } from 'react-icons/fa';

const Navbar = ({ fullName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { visibilitySettings } = usePortfolioData();

  const navLinks = [
    { label: 'Bio', target: 'about', icon: <FaUser /> },
    { label: 'Timeline', target: 'education', icon: <FaGraduationCap /> },
    { label: 'Skills', target: 'skills', icon: <FaCode /> },
    { label: 'Projects', target: 'projects', icon: <FaFolderOpen /> },
    { label: 'Family', target: 'family', icon: <FaHeart /> },
    { label: 'Gallery', target: 'gallery', icon: <FaImage /> },
    { label: 'Contact', target: 'contact', icon: <FaEnvelope /> },
  ];

  const filteredLinks = navLinks.filter(link => {
    return visibilitySettings ? visibilitySettings[link.target] !== false : true;
  });

  const handleScroll = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top glass-nav py-3 px-3">
      <div className="container">
        <span
          className="navbar-brand text-gold-gradient fw-bold fs-4"
          style={{ cursor: 'pointer', letterSpacing: '2px' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {fullName ? fullName.toUpperCase() : 'PORTFOLIO & BIODATA'}
        </span>

        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }} />
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {filteredLinks.map((link) => (
              <li key={link.target} className="nav-item mx-1">
                <button
                  onClick={() => handleScroll(link.target)}
                  className="btn btn-link nav-link text-white d-flex align-items-center gap-2 hover-gold"
                  style={{ textDecoration: 'none' }}
                >
                  <span className="text-gold">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

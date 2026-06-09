import React from 'react';

const Footer = ({ profileName }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ borderTop: '1px solid var(--glass-border)' }} className="bg-black py-5 mt-auto">
      <div className="container text-center">
        <h4 className="text-gold-gradient fw-bold mb-3">{profileName || 'Digital Profile'}</h4>
        <p className="text-muted small mb-4">
          Personal Digital Biodata, Portfolio & Resume Management System
        </p>
        <div className="mb-4 d-flex justify-content-center gap-3">
          <span className="text-white-50">#Minimalism</span>
          <span className="text-gold">•</span>
          <span className="text-white-50">#Glassmorphism</span>
          <span className="text-gold">•</span>
          <span className="text-white-50">#PremiumDesign</span>
        </div>
        <p className="text-muted small mb-0">
          &copy; {currentYear} {profileName || 'Administrator'}. All rights reserved. Powered by Antigravity CMS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Lightbox = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div
      onClick={onClose}
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center px-3"
      style={{
        background: 'rgba(0,0,0,0.95)',
        zIndex: 9999,
        cursor: 'pointer'
      }}
    >
      <button
        onClick={onClose}
        className="position-absolute btn border-0 text-white-50 p-3"
        style={{
          top: '20px',
          right: '20px',
          fontSize: '24px',
          transition: 'all 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.color = '#D4AF37'}
        onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
      >
        <FaTimes />
      </button>

      <img
        src={src}
        alt="Expanded Preview"
        className="img-fluid rounded shadow-lg"
        style={{
          maxHeight: '90vh',
          maxWidth: '100%',
          objectFit: 'contain'
        }}
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

export default Lightbox;

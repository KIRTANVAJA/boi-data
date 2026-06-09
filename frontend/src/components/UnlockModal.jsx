import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext.jsx';
import { toast } from 'react-toastify';
import { FaKey, FaTimes, FaLock } from 'react-icons/fa';

const UnlockModal = ({ isOpen, onClose }) => {
  const [accessKey, setAccessKey] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState(0); // seconds left for lockout
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus();
      }, 100);
    }
  }, [isOpen]);

  // Handle lockout countdown
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setTimeout(() => {
        setLockoutTime((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (attempts >= 5) {
      // Lockout duration completed, reset attempts
      setAttempts(0);
    }
  }, [lockoutTime, attempts]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lockoutTime > 0) {
      toast.warning(`System is locked. Please wait ${lockoutTime} seconds.`);
      return;
    }

    if (!accessKey) {
      toast.warning('Please enter the developer key.');
      return;
    }

    const success = await login(accessKey);

    if (success) {
      toast.success('Access granted! Entering dashboard...');
      setAttempts(0);
      setAccessKey('');
      onClose();
      navigate('/admin');
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setAccessKey('');
      
      if (newAttempts >= 5) {
        setLockoutTime(30);
        toast.error('Too many failed attempts! System locked for 30 seconds.');
      } else {
        toast.error(`Access key rejected. ${5 - newAttempts} attempts remaining.`);
      }
    }
  };

  return (
    <div 
      className="d-flex align-items-center justify-content-center position-fixed w-100 h-100 top-0 start-0"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        zIndex: 2000,
        transition: 'all 0.3s ease-in-out'
      }}
    >
      <div 
        style={{ maxWidth: '400px', width: '90%', position: 'relative' }} 
        className="glass-card p-4 shadow-lg text-center"
      >
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="btn-close position-absolute top-0 end-0 m-3 text-gold"
          aria-label="Close"
          style={{ border: 'none', background: 'none', fontSize: '1.2rem', cursor: 'pointer' }}
          disabled={lockoutTime > 0}
        >
          <FaTimes className="text-gold" />
        </button>

        <div className="mb-4">
          <div 
            style={{ width: '50px', height: '50px', margin: '0 auto' }} 
            className="badge-glow rounded-circle d-flex align-items-center justify-content-center mb-3 text-gold fs-5"
          >
            {lockoutTime > 0 ? <FaLock className="text-danger" /> : <FaKey />}
          </div>
          <h4 className="fw-bold text-gold-gradient mb-1">Developer Authorization</h4>
          <p className="text-muted small">Access restricted to platform developer credentials</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              ref={inputRef}
              type="password"
              className="form-control glass-input text-center"
              placeholder={lockoutTime > 0 ? 'Inputs locked' : 'Enter Developer Key...'}
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              disabled={lockoutTime > 0}
            />
            {lockoutTime > 0 && (
              <span className="text-danger small mt-2 d-block fw-semibold">
                Retry available in {lockoutTime} seconds
              </span>
            )}
          </div>

          <button 
            type="submit" 
            className="btn btn-gold w-100 mt-2"
            disabled={lockoutTime > 0}
          >
            Authorize Connection
          </button>
        </form>

        <div className="mt-3 small text-muted">
          Default Key: <code>adminpassword123</code>
        </div>
      </div>
    </div>
  );
};

export default UnlockModal;

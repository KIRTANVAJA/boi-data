import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { toast } from 'react-toastify';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      toast.warning('Please enter the access password');
      return;
    }

    const success = login(password);
    if (success) {
      toast.success('Admin access granted!');
      navigate('/admin');
    } else {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-black px-3 position-relative">
      <div 
        style={{
          position: 'absolute', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)',
          top: '20%', left: '20%', zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute', width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)',
          bottom: '20%', right: '20%', zIndex: 0
        }}
      />

      <div style={{ maxWidth: '420px', width: '100%', zIndex: 1 }} className="glass-card p-5">
        <div className="text-center mb-5">
          <div 
            style={{ width: '60px', height: '60px', margin: '0 auto' }} 
            className="badge-glow rounded-circle d-flex align-items-center justify-content-center mb-3 text-gold fs-4"
          >
            <FaLock />
          </div>
          <h2 className="fw-bold text-gold-gradient mb-1">CMS Admin Gateway</h2>
          <p className="text-muted small">Enter passkey to edit your digital biodata & portfolio</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label text-gold small fw-semibold">Enter Password</label>
            <div className="input-group">
              <span style={{ borderRight: 'none' }} className="input-group-text bg-transparent border-secondary text-white-50">
                <FaLock />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                style={{ borderLeft: 'none', borderRight: 'none' }}
                className="form-control glass-input"
                placeholder="Enter password key"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                style={{ borderLeft: 'none' }}
                className="input-group-text bg-transparent border-secondary text-white-50"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <span className="text-muted small mt-2 d-block">Default Password: <code>adminpassword123</code></span>
          </div>

          <button type="submit" className="btn btn-gold w-100 mt-2">
            Unlock Dashboard
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/" className="text-muted small hover-gold text-decoration-none">
            ← Back to Profile Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { toast } from 'react-toastify';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.warning('Please enter both username and password');
      return;
    }

    setLoading(true);
    try {
      await login(username, password);
      toast.success('Admin login successful!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-black px-3">
      {/* Glow background effects */}
      <div 
        style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)',
          top: '20%',
          left: '20%',
          zIndex: 0
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: '350px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, rgba(0,0,0,0) 70%)',
          bottom: '15%',
          right: '15%',
          zIndex: 0
        }}
      />

      <div style={{ maxWidth: '450px', width: '100%', zIndex: 1 }} className="glass-card p-5 animate-fade-up">
        <div className="text-center mb-5">
          <div 
            style={{ width: '64px', height: '64px', margin: '0 auto' }} 
            className="badge-glow rounded-circle d-flex align-items-center justify-content-center mb-3"
          >
            <Lock className="text-gold" size={28} />
          </div>
          <h2 className="fw-bold text-gold-gradient mb-1">CMS Control Center</h2>
          <p className="text-muted small">Enter admin credentials to manage your digital profile</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="form-label text-gold small fw-semibold">Username</label>
            <div className="input-group">
              <span style={{ borderRight: 'none' }} className="input-group-text bg-transparent border-secondary text-white-50">
                <User size={18} />
              </span>
              <input
                type="text"
                style={{ borderLeft: 'none' }}
                className="form-control glass-input"
                placeholder="Enter admin username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="form-label text-gold small fw-semibold">Password</label>
            <div className="input-group">
              <span style={{ borderRight: 'none' }} className="input-group-text bg-transparent border-secondary text-white-50">
                <Lock size={18} />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                style={{ borderLeft: 'none', borderRight: 'none' }}
                className="form-control glass-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <button
                type="button"
                style={{ borderLeft: 'none' }}
                className="input-group-text bg-transparent border-secondary text-white-50"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-gold w-100 mt-4 d-flex align-items-center justify-content-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm text-black" role="status" aria-hidden="true" />
            ) : (
              'Access Dashboard'
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <a href="/" className="text-muted small hover-gold text-decoration-none">
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;

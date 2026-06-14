import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = () => {
    const clientId = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
    const redirectUri = window.location.origin + '/seo-tools/';
    const scope = 'openid email profile';
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}&prompt=select_account`;
    window.location.href = url;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    const mockUser = {
      id: Date.now().toString(),
      name: name,
      email: email,
      picture: null
    };
    login(mockUser);
    navigate('/');
  };

  return (
    <motion.div className="auth-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="auth-container">
        <motion.div className="auth-card" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="auth-logo">
            <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
              <defs>
                <linearGradient id="authGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4285f4" />
                  <stop offset="50%" stopColor="#34a853" />
                  <stop offset="100%" stopColor="#fbbc04" />
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="10" fill="url(#authGrad)"/>
              <circle cx="21" cy="21" r="9" stroke="white" strokeWidth="3" fill="none"/>
              <line x1="27.5" y1="27.5" x2="36" y2="36" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
            </svg>
          </div>
          <h1>Create Account</h1>
          <p className="auth-subtitle">Start using free SEO tools today</p>

          <button className="google-btn" onClick={handleGoogleSignup} type="button">
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="divider">
            <span>or sign up with email</span>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Signup;

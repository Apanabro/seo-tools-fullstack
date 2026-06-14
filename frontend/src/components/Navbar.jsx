import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/rank-tracker', label: 'Rank Tracker' },
    { path: '/seo-audit', label: 'SEO Audit' },
    { path: '/link-checker', label: 'Link Checker' },
    { path: '/meta-generator', label: 'Meta Tags' },
    { path: '/robots-generator', label: 'Robots.txt' },
    { path: '/sitemap-generator', label: 'Sitemap' },
  ];

  return (
    <motion.nav className={`navbar ${scrolled ? 'scrolled' : ''}`} initial={{ y: -80 }} animate={{ y: 0 }} transition={{ type: 'spring', stiffness: 100, damping: 20 }}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <motion.div className="logo-container" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <svg className="logo" viewBox="0 0 48 48" width="40" height="40" fill="none">
              <defs><linearGradient id="navGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4285f4" /><stop offset="50%" stopColor="#34a853" /><stop offset="100%" stopColor="#fbbc04" /></linearGradient></defs>
              <rect width="48" height="48" rx="10" fill="url(#navGrad)"/>
              <circle cx="21" cy="21" r="9" stroke="white" strokeWidth="3" fill="none"/>
              <line x1="27.5" y1="27.5" x2="36" y2="36" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M33 8 L33 17 M28.5 12.5 L33 8 L37.5 12.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="brand-text">SEO Tools</span>
          </motion.div>
        </Link>

        <ul className="nav-links desktop-only">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                {location.pathname === item.path && (
                  <motion.div className="active-indicator" layoutId="activeTab" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                )}
                <span className="nav-text">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="nav-auth">
          {user ? (
            <div className="user-menu-container" ref={userMenuRef}>
              <button className="user-avatar-btn" onClick={() => setUserMenuOpen(!userMenuOpen)}>
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="user-avatar-img" />
                ) : (
                  <div className="user-avatar-placeholder">{user.name?.charAt(0)?.toUpperCase()}</div>
                )}
              </button>
              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div className="user-dropdown" initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }}>
                    <div className="user-dropdown-header">
                      <strong>{user.name}</strong>
                      <span>{user.email}</span>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <button onClick={handleLogout} className="user-dropdown-item logout">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn-login">Sign In</Link>
              <Link to="/signup" className="btn-signup">Sign Up</Link>
            </div>
          )}
        </div>

        <button className={`mobile-menu-btn ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          <div className="hamburger"><span></span><span></span><span></span></div>
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}>
            <ul className="mobile-nav-links">
              {navItems.map((item, index) => (
                <motion.li key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }}>
                  <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>{item.label}</Link>
                </motion.li>
              ))}
            </ul>
            <div className="mobile-auth">
              {user ? (
                <>
                  <div className="mobile-user-info">
                    {user.picture ? <img src={user.picture} alt="" className="user-avatar-img" /> : <div className="user-avatar-placeholder">{user.name?.charAt(0)?.toUpperCase()}</div>}
                    <span>{user.name}</span>
                  </div>
                  <button onClick={handleLogout} className="btn-logout-mobile">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn-login">Sign In</Link>
                  <Link to="/signup" className="btn-signup">Sign Up</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

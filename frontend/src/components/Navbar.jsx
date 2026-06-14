import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const userMenuRef = useRef(null);
  const toolsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileMenuOpen(false); setToolsOpen(false); }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target)) setToolsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => { logout(); setUserMenuOpen(false); navigate('/'); };

  const mainTools = [
    { path: '/keyword-research', label: 'Keyword Research', icon: '🔍' },
    { path: '/rank-tracker', label: 'Rank Tracker', icon: '📈' },
    { path: '/seo-audit', label: 'SEO Audit', icon: '📋' },
    { path: '/page-speed', label: 'Page Speed', icon: '⚡' },
    { path: '/backlink-checker', label: 'Backlink Checker', icon: '🔗' },
    { path: '/content-analyzer', label: 'Content Analyzer', icon: '📝' },
  ];

  const moreTools = [
    { path: '/sitemap-viewer', label: 'Sitemap Viewer' },
    { path: '/robots-txt-viewer', label: 'Robots.txt Viewer' },
    { path: '/regex-tester', label: 'Regex Tester' },
    { path: '/color-picker', label: 'Color Picker' },
    { path: '/text-diff', label: 'Text Diff' },
    { path: '/markdown-preview', label: 'Markdown Preview' },
    { path: '/cron-generator', label: 'Cron Generator' },
    { path: '/schema-generator', label: 'Schema Markup' },
    { path: '/redirect-checker', label: 'Redirect Checker' },
    { path: '/ip-lookup', label: 'IP Lookup' },
    { path: '/header-checker', label: 'Header Checker' },
    { path: '/mobile-test', label: 'Mobile Test' },
    { path: '/keyword-density', label: 'Keyword Density' },
    { path: '/link-checker', label: 'Link Checker' },
    { path: '/meta-generator', label: 'Meta Tags' },
    { path: '/robots-generator', label: 'Robots.txt' },
    { path: '/sitemap-generator', label: 'Sitemap' },
    { path: '/password-generator', label: 'Password Gen' },
    { path: '/qr-generator', label: 'QR Code Gen' },
    { path: '/json-formatter', label: 'JSON Formatter' },
    { path: '/encoder-decoder', label: 'Encoder/Decoder' },
    { path: '/hash-generator', label: 'Hash Generator' },
    { path: '/lorem-generator', label: 'Lorem Ipsum' },
  ];

  const navItems = [
    { path: '/', label: 'Home' },
    ...mainTools,
    { path: '/more-tools', label: 'More Tools', isDropdown: true },
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
            item.isDropdown ? (
              <li key="more-tools" className="dropdown-container" ref={toolsRef}>
                <button className={`nav-dropdown-btn ${toolsOpen ? 'active' : ''}`} onClick={() => setToolsOpen(!toolsOpen)}>
                  <span className="nav-text">More Tools</span>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" className={`dropdown-arrow ${toolsOpen ? 'open' : ''}`}><path d="M7 10l5 5 5-5z"/></svg>
                </button>
                <AnimatePresence>
                  {toolsOpen && (
                    <motion.div className="dropdown-menu" initial={{ opacity: 0, y: -8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.95 }} transition={{ duration: 0.15 }}>
                      {moreTools.map(tool => (
                        <Link key={tool.path} to={tool.path} className={`dropdown-item ${location.pathname === tool.path ? 'active' : ''}`}>
                          {tool.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ) : (
              <li key={item.path}>
                <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>
                  {location.pathname === item.path && (
                    <motion.div className="active-indicator" layoutId="activeTab" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <span className="nav-text">{item.label}</span>
                </Link>
              </li>
            )
          ))}
        </ul>

        <div className="nav-auth">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark mode">
            {dark ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/></svg>
            )}
          </button>
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
              <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
              {mainTools.map((item, index) => (
                <motion.li key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
                  <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>{item.icon} {item.label}</Link>
                </motion.li>
              ))}
              <li className="mobile-divider">More Tools</li>
              {moreTools.map((item, index) => (
                <motion.li key={item.path} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (mainTools.length + index) * 0.03 }}>
                  <Link to={item.path} className={location.pathname === item.path ? 'active' : ''}>{item.label}</Link>
                </motion.li>
              ))}
            </ul>
            <div className="mobile-auth">
              <button className="theme-toggle mobile-theme-toggle" onClick={toggleTheme}>
                {dark ? 'Light Mode' : 'Dark Mode'}
              </button>
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

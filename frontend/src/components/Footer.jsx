import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const seoTools = [
    { path: '/keyword-research', label: 'Keyword Research' },
    { path: '/rank-tracker', label: 'Rank Tracker' },
    { path: '/seo-audit', label: 'SEO Audit' },
    { path: '/page-speed', label: 'Page Speed' },
    { path: '/backlink-checker', label: 'Backlink Checker' },
    { path: '/content-analyzer', label: 'Content Analyzer' },
    { path: '/link-checker', label: 'Link Checker' },
    { path: '/keyword-density', label: 'Keyword Density' },
    { path: '/sitemap-viewer', label: 'Sitemap Viewer' },
    { path: '/robots-txt-viewer', label: 'Robots.txt Viewer' },
  ];

  const techTools = [
    { path: '/meta-generator', label: 'Meta Tags' },
    { path: '/robots-generator', label: 'Robots.txt' },
    { path: '/sitemap-generator', label: 'Sitemap' },
    { path: '/schema-generator', label: 'Schema Markup' },
    { path: '/redirect-checker', label: 'Redirect Checker' },
    { path: '/ip-lookup', label: 'IP Lookup' },
    { path: '/header-checker', label: 'Header Checker' },
    { path: '/mobile-test', label: 'Mobile Test' },
  ];

  const utilTools = [
    { path: '/password-generator', label: 'Password Generator' },
    { path: '/qr-generator', label: 'QR Code Generator' },
    { path: '/json-formatter', label: 'JSON Formatter' },
    { path: '/encoder-decoder', label: 'Encoder / Decoder' },
    { path: '/hash-generator', label: 'Hash Generator' },
    { path: '/lorem-generator', label: 'Lorem Ipsum' },
    { path: '/color-picker', label: 'Color Picker' },
  ];

  const devTools = [
    { path: '/regex-tester', label: 'Regex Tester' },
    { path: '/text-diff', label: 'Text Diff' },
    { path: '/markdown-preview', label: 'Markdown Preview' },
    { path: '/cron-generator', label: 'Cron Generator' },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-container">
          <div className="footer-section footer-brand">
            <div className="footer-logo">
              <svg viewBox="0 0 48 48" width="36" height="36" fill="none">
                <defs>
                  <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4285f4" />
                    <stop offset="50%" stopColor="#34a853" />
                    <stop offset="100%" stopColor="#fbbc04" />
                  </linearGradient>
                </defs>
                <rect width="48" height="48" rx="10" fill="url(#footerGrad)"/>
                <circle cx="21" cy="21" r="9" stroke="white" strokeWidth="3" fill="none"/>
                <line x1="27.5" y1="27.5" x2="36" y2="36" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
              </svg>
              <span>SEO Tools</span>
            </div>
            <p>31 professional SEO and developer tools. Analyze, audit, and optimize your website for better search rankings. No signup required.</p>
            <div className="footer-badges">
              <span className="footer-badge">100% Free</span>
              <span className="footer-badge">No Signup</span>
              <span className="footer-badge">Privacy First</span>
            </div>
          </div>

          <div className="footer-section">
            <h4>SEO Tools</h4>
            <ul>
              {seoTools.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Technical Tools</h4>
            <ul>
              {techTools.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Utilities</h4>
            <ul>
              {utilTools.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Developer Tools</h4>
            <ul>
              {devTools.map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} SEO Tools. All rights reserved.</p>
          <div className="footer-links">
            <a href="mailto:support@seo-tools.com">Contact</a>
            <span className="footer-dot">·</span>
            <a href="/privacy">Privacy</a>
            <span className="footer-dot">·</span>
            <a href="/terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

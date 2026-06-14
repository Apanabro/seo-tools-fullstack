import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const toolLinks = [
    { path: '/keyword-research', label: 'Keyword Research' },
    { path: '/rank-tracker', label: 'Rank Tracker' },
    { path: '/seo-audit', label: 'SEO Audit' },
    { path: '/page-speed', label: 'Page Speed' },
    { path: '/backlink-checker', label: 'Backlink Checker' },
    { path: '/content-analyzer', label: 'Content Analyzer' },
    { path: '/link-checker', label: 'Link Checker' },
    { path: '/meta-generator', label: 'Meta Tags' },
    { path: '/robots-generator', label: 'Robots.txt' },
    { path: '/sitemap-generator', label: 'Sitemap' },
    { path: '/schema-generator', label: 'Schema Markup' },
    { path: '/redirect-checker', label: 'Redirect Checker' },
    { path: '/ip-lookup', label: 'IP Lookup' },
    { path: '/header-checker', label: 'Header Checker' },
    { path: '/mobile-test', label: 'Mobile Test' },
    { path: '/keyword-density', label: 'Keyword Density' },
    { path: '/password-generator', label: 'Password Generator' },
    { path: '/qr-generator', label: 'QR Code Generator' },
    { path: '/json-formatter', label: 'JSON Formatter' },
    { path: '/encoder-decoder', label: 'Encoder / Decoder' },
    { path: '/hash-generator', label: 'Hash Generator' },
    { path: '/lorem-generator', label: 'Lorem Ipsum' },
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
            <p>10 professional SEO tools powered by client-side automation. Analyze, audit, and optimize your website for better search rankings. No signup required.</p>
            <div className="footer-badges">
              <span className="footer-badge">100% Free</span>
              <span className="footer-badge">No Signup</span>
              <span className="footer-badge">Privacy First</span>
            </div>
          </div>

          <div className="footer-section">
            <h4>SEO Tools</h4>
            <ul>
              {toolLinks.slice(0, 8).map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Technical Tools</h4>
            <ul>
              {toolLinks.slice(8, 16).map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Utility Tools</h4>
            <ul>
              {toolLinks.slice(16).map((link) => (
                <li key={link.path}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-section">
            <h4>Resources</h4>
            <ul>
              <li><a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Google Search Console</a></li>
              <li><a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer">PageSpeed Insights</a></li>
              <li><a href="https://schema.org/" target="_blank" rel="noopener noreferrer">Schema.org</a></li>
              <li><a href="https://www.sitemaps.org/" target="_blank" rel="noopener noreferrer">Sitemaps.org</a></li>
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

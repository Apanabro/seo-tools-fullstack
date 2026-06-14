import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const PROXY = 'https://api.allorigins.win/raw?url=';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

async function getHeaders(url) {
  const startTime = Date.now();
  const res = await fetch(PROXY + encodeURIComponent(url));
  const endTime = Date.now();
  const html = await res.text();

  const headers = {};
  res.headers.forEach((value, key) => { headers[key] = value; });

  const securityHeaders = [
    { name: 'Strict-Transport-Security', present: !!headers['strict-transport-security'], impact: 'high', desc: 'Forces HTTPS connections' },
    { name: 'Content-Security-Policy', present: !!headers['content-security-policy'], impact: 'high', desc: 'Prevents XSS attacks' },
    { name: 'X-Frame-Options', present: !!headers['x-frame-options'], impact: 'medium', desc: 'Prevents clickjacking' },
    { name: 'X-Content-Type-Options', present: !!headers['x-content-type-options'], impact: 'medium', desc: 'Prevents MIME sniffing' },
    { name: 'X-XSS-Protection', present: !!headers['x-xss-protection'], impact: 'medium', desc: 'XSS filter in browsers' },
    { name: 'Referrer-Policy', present: !!headers['referrer-policy'], impact: 'low', desc: 'Controls referrer info' },
    { name: 'Permissions-Policy', present: !!headers['permissions-policy'], impact: 'low', desc: 'Controls browser features' },
  ];

  const seoHeaders = [
    { name: 'Link (Canonical)', present: !!headers['link']?.includes('rel="canonical"'), desc: 'Canonical URL hint' },
    { name: 'X-Robots-Tag', present: !!headers['x-robots-tag'], desc: 'Robots directives' },
  ];

  return { url, headers, statusCode: res.status, statusText: res.statusText, time: endTime - startTime, htmlSize: new Blob([html]).size, securityHeaders, seoHeaders };
}

const HeaderChecker = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await getHeaders(url);
      setResult(data);
    } catch (err) {
      setError('Failed to fetch headers. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const headerEntries = result ? Object.entries(result.headers) : [];
  const filteredHeaders = activeTab === 'all' ? headerEntries :
    activeTab === 'security' ? headerEntries.filter(([k]) => result.securityHeaders.some(h => h.name.toLowerCase() === k.toLowerCase())) :
    headerEntries.filter(([k]) => k.startsWith('x-') || k.startsWith('link') || k.startsWith('content-'));

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34a853" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
            <path fill="url(#headerGrad)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <h1>HTTP Header Checker</h1>
        <p>Inspect HTTP response headers, security headers, and SEO-related headers.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="url">Enter a URL</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--gray-400)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6z"/></svg>
              <input type="url" id="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span>Fetching Headers...</> : 'Check Headers'}
          </button>
        </form>

        {error && <motion.div className="result-box error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><h3>Error</h3><p>{error}</p></motion.div>}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="metric-cards">
              <div className="metric-card">
                <div className="metric-label">Status</div>
                <div className="metric-value" style={{ color: result.statusCode < 400 ? 'var(--google-green)' : 'var(--google-red)' }}>{result.statusCode}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Response Time</div>
                <div className="metric-value">{result.time}ms</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Total Headers</div>
                <div className="metric-value">{headerEntries.length}</div>
              </div>
            </div>

            {/* Security Assessment */}
            <div className="result-box success" style={{ marginTop: 24 }}>
              <h3>Security Assessment</h3>
              <div className="security-grid">
                {result.securityHeaders.map((h, i) => (
                  <div key={i} className={`security-item ${h.present ? 'passed' : 'failed'}`}>
                    <div className="security-icon">
                      {h.present ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#34a853"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#ea4335"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                      )}
                    </div>
                    <div className="security-info">
                      <span className="security-name">{h.name}</span>
                      <span className="security-desc">{h.desc}</span>
                    </div>
                    <span className={`impact-badge ${h.impact}`}>{h.impact}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All Headers */}
            <div className="result-box success" style={{ marginTop: 16 }}>
              <h3>All Response Headers</h3>
              <div className="header-table">
                {filteredHeaders.map(([key, value], i) => (
                  <div key={i} className="header-row">
                    <span className="header-key">{key}</span>
                    <span className="header-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>What Gets Checked</h3>
          <ul>
            <li>HTTP status code and response time</li>
            <li>Security headers (HSTS, CSP, X-Frame-Options)</li>
            <li>SEO headers (X-Robots-Tag, Link canonical)</li>
            <li>Server and powered-by headers</li>
            <li>CORS and caching headers</li>
            <li>Complete header inventory</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default HeaderChecker;

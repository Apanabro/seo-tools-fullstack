import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const PROXY = 'https://api.allorigins.win/raw?url=';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

function analyzeMobile(html, url) {
  const checks = [];
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  const hasResponsiveCSS = /@media[^{]*\b(max-width|min-width)\b/i.test(html);
  const hasFluidImages = /max-width\s*:\s*100%/i.test(html) || /img[^>]+style[^>]+width\s*:\s*100%/i.test(html);
  const hasTouchIcons = /rel=["']apple-touch-icon["']/i.test(html);
  const hasMobileWebApp = /rel=["']mobile-web-app["']/i.test(html);
  const hasAMP = /rel=["']amphtml["']/i.test(html);
  const hasMediaQueries = (html.match(/@media/gi) || []).length;
  const hasTextSizeAdjust = /text-size-adjust/i.test(html) || /-webkit-text-size-adjust/i.test(html);
  const hasFlexbox = /display\s*:\s*flex/i.test(html);
  const hasGrid = /display\s*:\s*grid/i.test(html);
  const hasResponsiveImages = /srcset/i.test(html) || /sizes=["']/i.test(html);
  const hasLazyLoading = /loading=["']lazy["']/i.test(html);
  const hasSmallFont = /font-size\s*:\s*(\d+)px/i.test(html);

  checks.push({ name: 'Viewport Meta Tag', passed: hasViewport, impact: 'critical', desc: 'Essential for mobile rendering' });
  checks.push({ name: 'Responsive CSS (Media Queries)', passed: hasResponsiveCSS, impact: 'high', desc: `${hasMediaQueries} media queries found` });
  checks.push({ name: 'Fluid Images', passed: hasFluidImages, impact: 'high', desc: 'Images scale with container' });
  checks.push({ name: 'Responsive Images (srcset)', passed: hasResponsiveImages, impact: 'medium', desc: 'Different images for different screens' });
  checks.push({ name: 'Lazy Loading', passed: hasLazyLoading, impact: 'medium', desc: 'Deferred image loading' });
  checks.push({ name: 'Apple Touch Icon', passed: hasTouchIcons, impact: 'low', desc: 'iOS home screen icon' });
  checks.push({ name: 'Mobile Web App Capable', passed: hasMobileWebApp, impact: 'low', desc: 'Can be added to home screen' });
  checks.push({ name: 'Text Size Adjust', passed: hasTextSizeAdjust, impact: 'low', desc: 'Prevents text inflation on iOS' });
  checks.push({ name: 'Flexbox Layout', passed: hasFlexbox, impact: 'info', desc: 'Modern layout system' });
  checks.push({ name: 'CSS Grid Layout', passed: hasGrid, impact: 'info', desc: 'Advanced layout system' });

  const passed = checks.filter(c => c.passed).length;
  const criticalFailed = checks.filter(c => !c.passed && c.impact === 'critical').length;
  const highFailed = checks.filter(c => !c.passed && c.impact === 'high').length;
  let score = Math.round((passed / checks.length) * 100);
  if (criticalFailed > 0) score = Math.min(score, 40);
  if (highFailed > 0) score = Math.min(score, 70);

  const isAMP = hasAMP;
  const viewportContent = html.match(/<meta[^>]+name=["']viewport["'][^>]+content=["']([^"']+)["']/i);
  const viewportContentStr = viewportContent ? viewportContent[1] : 'Not found';

  const recommendations = [];
  if (!hasViewport) recommendations.push('Add <meta name="viewport" content="width=device-width, initial-scale=1">');
  if (!hasResponsiveCSS) recommendations.push('Add responsive CSS with media queries for different screen sizes');
  if (!hasFluidImages) recommendations.push('Make images fluid with max-width: 100%');
  if (!hasLazyLoading) recommendations.push('Add loading="lazy" to below-fold images');
  if (!hasTouchIcons) recommendations.push('Add apple-touch-icon for iOS users');
  if (!hasResponsiveImages) recommendations.push('Use srcset for responsive image delivery');

  return { url, score, checks, passed, total: checks.length, isAMP, viewport: viewportContentStr, recommendations };
}

const MobileTest = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(PROXY + encodeURIComponent(url));
      const html = await res.text();
      setResult(analyzeMobile(html, url));
    } catch (err) {
      setError('Failed to fetch page. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (s) => s >= 80 ? '#34a853' : s >= 50 ? '#fbbc04' : '#ea4335';

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="mobileGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4285f4" /><stop offset="100%" stopColor="#34a853" /></linearGradient></defs>
            <path fill="url(#mobileGrad)" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
          </svg>
        </div>
        <h1>Mobile Friendliness Test</h1>
        <p>Check if your website is optimized for mobile devices.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="url">Enter a URL</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--gray-400)"><path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99z"/></svg>
              <input type="url" id="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span>Testing...</> : 'Test Mobile Friendliness'}
          </button>
        </form>

        {error && <motion.div className="result-box error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><h3>Error</h3><p>{error}</p></motion.div>}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="score-display">
              <div className="score-circle" style={{ '--score-color': getScoreColor(result.score) }}>
                <svg viewBox="0 0 120 120" className="score-svg">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gray-200)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={getScoreColor(result.score)} strokeWidth="8" strokeDasharray={`${result.score * 3.267} 326.7`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                <div className="score-inner">
                  <span className="score-number">{result.score}</span>
                  <span className="score-grade">{result.score >= 80 ? 'Mobile' : 'Issues'}</span>
                </div>
              </div>
              <div className="score-info">
                <h3>Mobile Score</h3>
                <p>{result.passed}/{result.total} checks passed</p>
                {result.isAMP && <p style={{ color: 'var(--google-blue)', fontWeight: 500 }}>AMP page detected</p>}
              </div>
            </div>

            <div className="result-box success" style={{ marginTop: 24 }}>
              <h3>Mobile Checks</h3>
              {result.checks.map((check, i) => (
                <div key={i} className={`check-item ${check.passed ? 'passed' : 'failed'}`}>
                  <div className="check-icon">
                    {check.passed ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#34a853"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="#ea4335"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    )}
                  </div>
                  <span className="check-name">{check.name}</span>
                  <span className="check-desc">{check.desc}</span>
                  <span className={`impact-badge ${check.impact}`}>{check.impact}</span>
                </div>
              ))}
            </div>

            {result.recommendations.length > 0 && (
              <div className="result-box success" style={{ marginTop: 16 }}>
                <h3>Recommendations ({result.recommendations.length})</h3>
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="check-item info">
                    <div className="check-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="var(--google-blue)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg></div>
                    <span className="check-name">{rec}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="tool-info">
          <h3>What Gets Tested</h3>
          <ul>
            <li>Viewport meta tag presence</li>
            <li>Responsive CSS with media queries</li>
            <li>Fluid and responsive images</li>
            <li>Lazy loading implementation</li>
            <li>Apple touch icons</li>
            <li>Mobile web app capability</li>
            <li>Text size adjustment</li>
            <li>Modern layout systems (Flexbox, Grid)</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileTest;

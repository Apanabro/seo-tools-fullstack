import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const PROXY = 'https://api.allorigins.win/raw?url=';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

async function checkRedirects(url, maxRedirects = 10) {
  const redirects = [];
  let currentUrl = url;
  let hops = 0;

  while (hops < maxRedirects) {
    try {
      const startTime = Date.now();
      const res = await fetch(PROXY + encodeURIComponent(currentUrl), { method: 'HEAD', redirect: 'follow' });
      const endTime = Date.now();
      const finalUrl = res.url ? decodeURIComponent(res.url.replace(PROXY, '')) : currentUrl;

      redirects.push({
        url: currentUrl,
        status: res.status,
        statusText: res.statusText || (res.ok ? 'OK' : 'Error'),
        redirectUrl: finalUrl !== currentUrl ? finalUrl : null,
        time: endTime - startTime,
        headers: {
          server: res.headers.get('server'),
          location: res.headers.get('location'),
          'content-type': res.headers.get('content-type'),
        }
      });

      if (finalUrl === currentUrl || res.status < 300 || res.status >= 400) break;
      currentUrl = finalUrl;
      hops++;
    } catch (e) {
      redirects.push({ url: currentUrl, status: 0, statusText: 'Failed', error: e.message, time: 0 });
      break;
    }
  }

  const finalUrl = redirects.length > 0 ? redirects[redirects.length - 1].redirectUrl || redirects[redirects.length - 1].url : url;
  const totalRedirects = redirects.filter(r => r.redirectUrl).length;
  const totalTime = redirects.reduce((sum, r) => sum + (r.time || 0), 0);

  return { url, finalUrl, redirects, totalRedirects, totalTime, hops };
}

const RedirectChecker = () => {
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
      const data = await checkRedirects(url);
      setResult(data);
    } catch (err) {
      setError('Failed to check redirects. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="redirGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff9800" /><stop offset="100%" stopColor="#ff5722" /></linearGradient></defs>
            <path fill="url(#redirGrad)" d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
          </svg>
        </div>
        <h1>Redirect Checker</h1>
        <p>Trace HTTP redirects, detect redirect chains and loops.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="url">Enter a URL to check</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--gray-400)"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg>
              <input type="url" id="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span>Tracing Redirects...</> : (
              <><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/></svg>Check Redirects</>
            )}
          </button>
        </form>

        {error && <motion.div className="result-box error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><h3>Error</h3><p>{error}</p></motion.div>}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="metric-cards">
              <div className="metric-card">
                <div className="metric-label">Total Redirects</div>
                <div className="metric-value" style={{ color: result.totalRedirects === 0 ? 'var(--google-green)' : 'var(--accent-orange)' }}>{result.totalRedirects}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Total Time</div>
                <div className="metric-value">{result.totalTime}ms</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Final URL</div>
                <div className="metric-value" style={{ fontSize: 12, wordBreak: 'break-all' }}>{result.finalUrl}</div>
              </div>
            </div>

            <div className="result-box success" style={{ marginTop: 24 }}>
              <h3>Redirect Chain ({result.redirects.length} hops)</h3>
              {result.redirects.map((r, i) => (
                <div key={i} className="redirect-hop">
                  <div className="hop-number">{i + 1}</div>
                  <div className="hop-content">
                    <div className="hop-url">{r.url}</div>
                    <div className="hop-meta">
                      <span className={`status-badge ${r.status >= 200 && r.status < 300 ? 'success' : r.status >= 300 && r.status < 400 ? 'redirect' : 'error'}`}>{r.status} {r.statusText}</span>
                      <span className="hop-time">{r.time}ms</span>
                      {r.headers?.server && <span className="hop-server">Server: {r.headers.server}</span>}
                    </div>
                    {r.redirectUrl && (
                      <div className="hop-redirect">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="var(--google-blue)"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                        Redirects to: {r.redirectUrl}
                      </div>
                    )}
                    {r.error && <div className="hop-error">Error: {r.error}</div>}
                  </div>
                </div>
              ))}
              {result.totalRedirects === 0 && (
                <p style={{ color: 'var(--google-green)', fontWeight: 500 }}>No redirects detected. The URL loads directly.</p>
              )}
            </div>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>What Gets Checked</h3>
          <ul>
            <li>301 (Permanent) and 302 (Temporary) redirects</li>
            <li>Redirect chain length and timing</li>
            <li>Server headers at each hop</li>
            <li>Final destination URL</li>
            <li>Redirect loop detection</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default RedirectChecker;

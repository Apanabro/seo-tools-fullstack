import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const PROXY = 'https://api.allorigins.win/raw?url=';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

async function lookupIP(url) {
  const res = await fetch(PROXY + encodeURIComponent(url));
  const html = await res.text();

  const ipRegex = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g;
  const ips = [...new Set(html.match(ipRegex) || [])];

  const serverHeader = res.headers?.get('server') || 'Unknown';
  const poweredBy = res.headers?.get('x-powered-by') || 'Unknown';

  const hasSSL = url.startsWith('https');
  const hasWAF = /cloudflare|akamai|incapsula|sucuri|wordfence/i.test(serverHeader);
  const hasCDN = /cloudflare|akamai|cloudfront|fastly|cdn/i.test(serverHeader);

  const hosting = serverHeader.toLowerCase().includes('cloudflare') ? 'Cloudflare' :
    serverHeader.toLowerCase().includes('apache') ? 'Apache' :
    serverHeader.toLowerCase().includes('nginx') ? 'Nginx' :
    serverHeader.toLowerCase().includes('cloudfront') ? 'AWS CloudFront' :
    serverHeader.toLowerCase().includes('gws') ? 'Google' :
    serverHeader.toLowerCase().includes('microsoft-iis') ? 'Microsoft IIS' :
    serverHeader !== 'Unknown' ? serverHeader : 'Unknown';

  return { url, ips, server: serverHeader, poweredBy, hasSSL, hasWAF, hasCDN, hosting, htmlSize: new Blob([html]).size, statusCode: res.status };
}

const IPLookup = () => {
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
      const data = await lookupIP(url);
      setResult(data);
    } catch (err) {
      setError('Failed to lookup. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="ipGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5ac8fa" /><stop offset="100%" stopColor="#5856d6" /></linearGradient></defs>
            <path fill="url(#ipGrad)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        </div>
        <h1>IP & Server Lookup</h1>
        <p>Find IP addresses, hosting provider, server software, and security features.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="url">Enter a URL</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--gray-400)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
              <input type="url" id="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span>Looking up...</> : 'Lookup IP & Server'}
          </button>
        </form>

        {error && <motion.div className="result-box error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><h3>Error</h3><p>{error}</p></motion.div>}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="metric-cards">
              <div className="metric-card">
                <div className="metric-label">Status Code</div>
                <div className="metric-value" style={{ color: result.statusCode < 400 ? 'var(--google-green)' : 'var(--google-red)' }}>{result.statusCode}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">IP Addresses</div>
                <div className="metric-value">{result.ips.length}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Page Size</div>
                <div className="metric-value">{(result.htmlSize / 1024).toFixed(1)}KB</div>
              </div>
            </div>

            <div className="result-box success" style={{ marginTop: 24 }}>
              <h3>Server Information</h3>
              <div className="info-grid">
                <div className="info-item"><span className="info-label">Server</span><span className="info-value">{result.server}</span></div>
                <div className="info-item"><span className="info-label">Hosting</span><span className="info-value">{result.hosting}</span></div>
                <div className="info-item"><span className="info-label">Powered By</span><span className="info-value">{result.poweredBy}</span></div>
                <div className="info-item"><span className="info-label">SSL/HTTPS</span><span className={`info-value ${result.hasSSL ? 'success' : 'error'}`}>{result.hasSSL ? 'Yes' : 'No'}</span></div>
                <div className="info-item"><span className="info-label">CDN Detected</span><span className={`info-value ${result.hasCDN ? 'success' : ''}`}>{result.hasCDN ? 'Yes' : 'No'}</span></div>
                <div className="info-item"><span className="info-label">WAF Detected</span><span className={`info-value ${result.hasWAF ? 'success' : ''}`}>{result.hasWAF ? 'Yes' : 'No'}</span></div>
              </div>
            </div>

            {result.ips.length > 0 && (
              <div className="result-box success" style={{ marginTop: 16 }}>
                <h3>IP Addresses Found</h3>
                <div className="ip-list">
                  {result.ips.map((ip, i) => (
                    <div key={i} className="ip-item">
                      <span className="ip-address">{ip}</span>
                      <span className="ip-type">{ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('172.') ? 'Private' : 'Public'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="tool-info">
          <h3>What Gets Detected</h3>
          <ul>
            <li>Server IP addresses</li>
            <li>Web server software (Apache, Nginx, etc.)</li>
            <li>Hosting provider identification</li>
            <li>CDN detection (Cloudflare, CloudFront)</li>
            <li>WAF (Web Application Firewall) detection</li>
            <li>SSL/HTTPS status</li>
            <li>Page size and response time</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default IPLookup;

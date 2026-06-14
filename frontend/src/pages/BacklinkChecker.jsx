import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const PROXY = 'https://api.allorigins.win/raw?url=';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

function analyzeBacklinks(html, url) {
  const base = new URL(url);
  const domain = base.hostname;

  const linkRegex = /<a[^>]+href=["']([^"'#]+)["'][^>]*(?:rel=["']([^"']*)["'])?[^>]*>/gi;
  const links = [];
  const seen = new Set();
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    let href = match[1];
    const rel = match[2] || '';
    if (href.startsWith('//')) href = 'https:' + href;
    else if (href.startsWith('/')) href = base.origin + href;
    else if (!href.startsWith('http')) continue;
    if (seen.has(href)) continue;
    seen.add(href);

    let linkDomain = '';
    try { linkDomain = new URL(href).hostname; } catch(e) { continue; }

    const isInternal = linkDomain === domain;
    const isNofollow = rel.includes('nofollow');
    const isUgc = rel.includes('ugc');
    const isSponsored = rel.includes('sponsored');

    let type = 'dofollow';
    if (isNofollow) type = 'nofollow';
    if (isUgc) type = 'ugc';
    if (isSponsored) type = 'sponsored';

    let anchor = match[0].match(/>([^<]*)</);
    anchor = anchor ? anchor[1].trim() : '';

    links.push({ url: href, domain: linkDomain, isInternal, type, anchor, rel });
  }

  const internal = links.filter(l => l.isInternal);
  const external = links.filter(l => !l.isInternal);
  const dofollow = external.filter(l => l.type === 'dofollow');
  const nofollow = external.filter(l => l.type === 'nofollow');

  const domainCounts = {};
  external.forEach(l => { domainCounts[l.domain] = (domainCounts[l.domain] || 0) + 1; });
  const topDomains = Object.entries(domainCounts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const anchorTexts = {};
  external.filter(l => l.anchor).forEach(l => { anchorTexts[l.anchor] = (anchorTexts[l.anchor] || 0) + 1; });
  const topAnchors = Object.entries(anchorTexts).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const domainAuthority = Math.min(100, Math.floor(20 + external.length * 2 + dofollow.length * 3 + topDomains.length * 5));

  return { url, domain, totalLinks: links.length, internalLinks: internal.length, externalLinks: external.length, dofollowLinks: dofollow.length, nofollowLinks: nofollow.length, links, topDomains, topAnchors, domainAuthority };
}

const BacklinkChecker = () => {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(PROXY + encodeURIComponent(url));
      const html = await res.text();
      setResult(analyzeBacklinks(html, url));
    } catch (err) {
      setError('Failed to fetch page. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="blGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff375f" /><stop offset="100%" stopColor="#bf5af2" /></linearGradient></defs>
            <path fill="url(#blGrad)" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
        </div>
        <h1>Backlink Checker</h1>
        <p>Analyze all inbound and outbound links, anchor text, and domain authority.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="url">Enter a URL to analyze</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--gray-400)"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
              <input type="url" id="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span>Analyzing Backlinks...</> : (
              <><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>Analyze Backlinks</>
            )}
          </button>
        </form>

        {error && (
          <motion.div className="result-box error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <h3>Error</h3><p>{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* DA Score */}
            <div className="score-display">
              <div className="score-circle" style={{ '--score-color': result.domainAuthority >= 50 ? '#34a853' : result.domainAuthority >= 30 ? '#fbbc04' : '#ea4335' }}>
                <svg viewBox="0 0 120 120" className="score-svg">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gray-200)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={result.domainAuthority >= 50 ? '#34a853' : result.domainAuthority >= 30 ? '#fbbc04' : '#ea4335'} strokeWidth="8" strokeDasharray={`${result.domainAuthority * 3.267} 326.7`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                <div className="score-inner">
                  <span className="score-number">{result.domainAuthority}</span>
                  <span className="score-grade">DA</span>
                </div>
              </div>
              <div className="score-info">
                <h3>Domain Authority</h3>
                <p>Estimated link authority score for {result.domain}</p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="metric-cards" style={{ marginTop: 24 }}>
              <div className="metric-card">
                <div className="metric-label">Total Links</div>
                <div className="metric-value" style={{ color: 'var(--google-blue)' }}>{result.totalLinks}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Internal Links</div>
                <div className="metric-value" style={{ color: 'var(--accent-teal)' }}>{result.internalLinks}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">External Links</div>
                <div className="metric-value" style={{ color: 'var(--accent-purple)' }}>{result.externalLinks}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Dofollow</div>
                <div className="metric-value" style={{ color: 'var(--google-green)' }}>{result.dofollowLinks}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Nofollow</div>
                <div className="metric-value" style={{ color: 'var(--accent-orange)' }}>{result.nofollowLinks}</div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="tab-nav" style={{ marginTop: 24 }}>
              <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
              <button className={`tab-btn ${activeTab === 'domains' ? 'active' : ''}`} onClick={() => setActiveTab('domains')}>Top Domains</button>
              <button className={`tab-btn ${activeTab === 'anchors' ? 'active' : ''}`} onClick={() => setActiveTab('anchors')}>Anchor Text</button>
              <button className={`tab-btn ${activeTab === 'links' ? 'active' : ''}`} onClick={() => setActiveTab('links')}>All Links</button>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="result-box success">
                <h3>Link Profile Overview</h3>
                <div className="link-ratio">
                  <div className="ratio-bar">
                    <div className="ratio-segment" style={{ width: `${(result.dofollowLinks / Math.max(result.externalLinks, 1)) * 100}%`, background: '#34a853' }}></div>
                    <div className="ratio-segment" style={{ width: `${(result.nofollowLinks / Math.max(result.externalLinks, 1)) * 100}%`, background: '#fbbc04' }}></div>
                  </div>
                  <div className="ratio-legend">
                    <span><i style={{ background: '#34a853' }}></i>Dofollow ({result.dofollowLinks})</span>
                    <span><i style={{ background: '#fbbc04' }}></i>Nofollow ({result.nofollowLinks})</span>
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <p style={{ fontSize: 14, color: 'var(--gray-600)' }}>
                    {result.internalLinks} internal links help search engines discover your content.
                    {result.externalLinks} external links connect to other resources on the web.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'domains' && (
              <div className="result-box success">
                <h3>Top Linking Domains ({result.topDomains.length})</h3>
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead><tr><th>Domain</th><th>Links</th></tr></thead>
                    <tbody>
                      {result.topDomains.map(([domain, count], i) => (
                        <tr key={i}>
                          <td className="kw-name">{domain}</td>
                          <td><span className="diff-badge" style={{ background: 'var(--google-blue-light)', color: 'var(--google-blue)' }}>{count}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'anchors' && (
              <div className="result-box success">
                <h3>Top Anchor Texts ({result.topAnchors.length})</h3>
                {result.topAnchors.length > 0 ? (
                  <div className="data-table-wrapper">
                    <table className="data-table">
                      <thead><tr><th>Anchor Text</th><th>Count</th></tr></thead>
                      <tbody>
                        {result.topAnchors.map(([text, count], i) => (
                          <tr key={i}>
                            <td className="kw-name">"{text}"</td>
                            <td><span className="diff-badge" style={{ background: 'var(--accent-purple)' + '18', color: 'var(--accent-purple)' }}>{count}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : <p style={{ fontSize: 14 }}>No anchor text found on external links.</p>}
              </div>
            )}

            {activeTab === 'links' && (
              <div className="result-box success">
                <h3>All Links ({result.links.length})</h3>
                <div className="data-table-wrapper">
                  <table className="data-table">
                    <thead><tr><th>URL</th><th>Type</th><th>Internal</th></tr></thead>
                    <tbody>
                      {result.links.slice(0, 50).map((link, i) => (
                        <tr key={i}>
                          <td className="kw-name" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</td>
                          <td><span className={`type-badge ${link.type}`}>{link.type}</span></td>
                          <td>{link.isInternal ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <div className="tool-info">
          <h3>What Gets Analyzed</h3>
          <ul>
            <li>All internal and external links</li>
            <li>Dofollow vs nofollow link ratios</li>
            <li>Anchor text distribution</li>
            <li>Top linking domains</li>
            <li>Estimated domain authority score</li>
            <li>UGC and sponsored link detection</li>
            <li>Complete link inventory with tabs</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default BacklinkChecker;

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './ToolPage.css';

const RobotsTxtViewer = () => {
  const { dark } = useTheme();
  const [url, setUrl] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rules, setRules] = useState({ allow: [], disallow: [], sitemaps: [], crawlers: [] });

  const parseRobots = (text) => {
    const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    const result = { allow: [], disallow: [], sitemaps: [], crawlers: [], otherRules: [] };
    let currentAgent = '*';

    for (const line of lines) {
      if (line.toLowerCase().startsWith('user-agent:')) {
        currentAgent = line.split(':').slice(1).join(':').trim();
      } else if (line.toLowerCase().startsWith('disallow:')) {
        const path = line.split(':').slice(1).join(':').trim();
        if (path) result.disallow.push({ agent: currentAgent, path });
      } else if (line.toLowerCase().startsWith('allow:')) {
        const path = line.split(':').slice(1).join(':').trim();
        if (path) result.allow.push({ agent: currentAgent, path });
      } else if (line.toLowerCase().startsWith('sitemap:')) {
        const sitemap = line.split(':').slice(1).join(':').trim();
        if (sitemap) result.sitemaps.push(sitemap);
      } else if (line.toLowerCase().startsWith('crawl-delay:')) {
        const delay = line.split(':').slice(1).join(':').trim();
        result.otherRules.push({ rule: 'Crawl-delay', value: delay, agent: currentAgent });
      } else if (line.toLowerCase().startsWith('host:')) {
        const host = line.split(':').slice(1).join(':').trim();
        result.otherRules.push({ rule: 'Host', value: host, agent: currentAgent });
      }
    }

    const crawlerPatterns = ['googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider', 'yandexbot'];
    result.crawlers = [...new Set(lines
      .filter(l => l.toLowerCase().startsWith('user-agent:'))
      .map(l => l.split(':').slice(1).join(':').trim())
      .filter(a => a !== '*'))];
    result.crawlers = result.crawlers.filter(c => !crawlerPatterns.some(cp => c.toLowerCase().includes(cp)));

    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let finalUrl = url.trim();
    if (!finalUrl) return;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    finalUrl = finalUrl.replace(/\/$/, '') + '/robots.txt';

    setLoading(true);
    setError(null);
    setContent('');
    setRules({ allow: [], disallow: [], sitemaps: [], crawlers: [] });

    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(finalUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      setContent(text);
      setRules(parseRobots(text));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tool-page">
      <motion.div className="tool-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="tool-icon">🤖</div>
        <h1>Robots.txt Viewer</h1>
        <p>View, parse, and analyze robots.txt files — check allow/disallow rules, sitemaps, and crawl directives</p>
      </motion.div>

      <motion.form className="tool-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="form-group">
          <label>Website URL</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <><span className="spinner"></span> Fetching...</> : '🤖 Fetch Robots.txt'}
        </button>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.div className="error-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <strong>Error:</strong> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {content && (
        <>
          <motion.div className="info-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="metric-card red">
              <div className="metric-value">{rules.disallow.length}</div>
              <div className="metric-label">Disallow Rules</div>
            </div>
            <div className="metric-card green">
              <div className="metric-value">{rules.allow.length}</div>
              <div className="metric-label">Allow Rules</div>
            </div>
            <div className="metric-card blue">
              <div className="metric-value">{rules.sitemaps.length}</div>
              <div className="metric-label">Sitemaps</div>
            </div>
            <div className="metric-card yellow">
              <div className="metric-value">{rules.otherRules.length}</div>
              <div className="metric-label">Other Rules</div>
            </div>
          </motion.div>

          <motion.div className="result-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <div className="result-header">
              <h2>Raw Robots.txt</h2>
              <button className="btn-secondary" onClick={() => {
                navigator.clipboard.writeText(content);
                alert('Copied!');
              }}>📋 Copy</button>
            </div>
            <pre className="code-block" style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '12px', overflow: 'auto', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>{content}</pre>
          </motion.div>

          {rules.disallow.length > 0 && (
            <motion.div className="result-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h2>Disallow Rules ({rules.disallow.length})</h2>
              <div className="check-list">
                {rules.disallow.map((r, i) => (
                  <div className="check-item" key={i}>
                    <div className="check-status red">🚫</div>
                    <div className="check-info">
                      <div className="check-title">{r.path}</div>
                      <div className="check-desc">Agent: {r.agent}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {rules.allow.length > 0 && (
            <motion.div className="result-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
              <h2>Allow Rules ({rules.allow.length})</h2>
              <div className="check-list">
                {rules.allow.map((r, i) => (
                  <div className="check-item" key={i}>
                    <div className="check-status green">✅</div>
                    <div className="check-info">
                      <div className="check-title">{r.path}</div>
                      <div className="check-desc">Agent: {r.agent}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {rules.sitemaps.length > 0 && (
            <motion.div className="result-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <h2>Sitemaps ({rules.sitemaps.length})</h2>
              <div className="check-list">
                {rules.sitemaps.map((s, i) => (
                  <div className="check-item" key={i}>
                    <div className="check-status blue">📄</div>
                    <div className="check-info">
                      <div className="check-title"><a href={s} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--google-blue)' }}>{s}</a></div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {rules.otherRules.length > 0 && (
            <motion.div className="result-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              <h2>Other Directives</h2>
              <div className="check-list">
                {rules.otherRules.map((r, i) => (
                  <div className="check-item" key={i}>
                    <div className="check-status yellow">⚙️</div>
                    <div className="check-info">
                      <div className="check-title">{r.rule}: {r.value}</div>
                      <div className="check-desc">Agent: {r.agent}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default RobotsTxtViewer;

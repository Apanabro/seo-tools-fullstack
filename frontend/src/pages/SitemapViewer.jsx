import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './ToolPage.css';

const SitemapViewer = () => {
  const { dark } = useTheme();
  const [url, setUrl] = useState('');
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [filter, setFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'loc', direction: 'asc' });

  const parseSitemap = useCallback((text) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) throw new Error('Invalid XML format');

    const urlElements = doc.querySelectorAll('url');
    const result = Array.from(urlElements).map(el => ({
      loc: el.querySelector('loc')?.textContent || '',
      lastmod: el.querySelector('lastmod')?.textContent || '',
      changefreq: el.querySelector('changefreq')?.textContent || '',
      priority: el.querySelector('priority')?.textContent || '',
    }));

    if (result.length === 0) throw new Error('No URLs found in sitemap');
    return result;
  }, []);

  const fetchSitemap = async (sitemapUrl) => {
    setLoading(true);
    setError(null);
    setUrls([]);
    setStats(null);

    try {
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(sitemapUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const text = await res.text();

      let parsedUrls;
      if (text.trim().startsWith('<?xml') || text.trim().startsWith('<urlset')) {
        parsedUrls = parseSitemap(text);
      } else if (text.trim().startsWith('<sitemapindex')) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/xml');
        const sitemaps = Array.from(doc.querySelectorAll('sitemap loc')).map(el => el.textContent);
        if (sitemaps.length === 0) throw new Error('Empty sitemap index');
        
        const allUrls = [];
        for (const sm of sitemaps.slice(0, 10)) {
          try {
            const subRes = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(sm)}`);
            const subText = await subRes.text();
            allUrls.push(...parseSitemap(subText));
          } catch {}
        }
        parsedUrls = allUrls;
      } else {
        throw new Error('Not a valid sitemap');
      }

      setUrls(parsedUrls);
      const domains = new Set(parsedUrls.map(u => {
        try { return new URL(u.loc).hostname; } catch { return ''; }
      }));
      const priorities = parsedUrls.map(u => parseFloat(u.priority)).filter(p => !isNaN(p));
      const extensions = {};
      parsedUrls.forEach(u => {
        const match = u.loc.match(/\.(\w+)$/);
        if (match) extensions[match[1]] = (extensions[match[1]] || 0) + 1;
      });

      setStats({
        total: parsedUrls.length,
        domains: domains.size,
        avgPriority: priorities.length ? (priorities.reduce((a,b) => a+b, 0) / priorities.length).toFixed(2) : 'N/A',
        extensions,
        withLastmod: parsedUrls.filter(u => u.lastmod).length,
        withPriority: parsedUrls.filter(u => u.priority).length,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let finalUrl = url.trim();
    if (!finalUrl) return;
    if (!finalUrl.startsWith('http')) finalUrl = 'https://' + finalUrl;
    if (!finalUrl.includes('sitemap') && !finalUrl.endsWith('.xml')) {
      const base = finalUrl.replace(/\/$/, '');
      finalUrl = `${base}/sitemap.xml`;
    }
    fetchSitemap(finalUrl);
  };

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedUrls = [...urls]
    .filter(u => !filter || u.loc.toLowerCase().includes(filter.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';
      return sortConfig.direction === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  return (
    <div className="tool-page">
      <motion.div className="tool-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="tool-icon">🗺️</div>
        <h1>Sitemap Viewer</h1>
        <p>Analyze XML sitemaps — view URLs, priorities, last modified dates, and structure</p>
      </motion.div>

      <motion.form className="tool-form" onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="form-group">
          <label>Website URL or Sitemap URL</label>
          <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com or https://example.com/sitemap.xml" />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? <><span className="spinner"></span> Analyzing...</> : '🔍 Analyze Sitemap'}
        </button>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.div className="error-box" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <strong>Error:</strong> {error}
          </motion.div>
        )}
      </AnimatePresence>

      {stats && (
        <motion.div className="info-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="metric-card blue">
            <div className="metric-value">{stats.total.toLocaleString()}</div>
            <div className="metric-label">Total URLs</div>
          </div>
          <div className="metric-card green">
            <div className="metric-value">{stats.domains}</div>
            <div className="metric-label">Domains</div>
          </div>
          <div className="metric-card yellow">
            <div className="metric-value">{stats.avgPriority}</div>
            <div className="metric-label">Avg Priority</div>
          </div>
          <div className="metric-card red">
            <div className="metric-value">{stats.withLastmod}</div>
            <div className="metric-label">With Lastmod</div>
          </div>
        </motion.div>
      )}

      {urls.length > 0 && (
        <motion.div className="result-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="result-header">
            <h2>Sitemap URLs ({sortedUrls.length})</h2>
            <div className="result-actions">
              <input type="text" value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter URLs..." style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--gray-200)', fontSize: '13px' }} />
              <button className="btn-secondary" onClick={() => {
                const csv = sortedUrls.map(u => `${u.loc},${u.lastmod},${u.changefreq},${u.priority}`).join('\n');
                const blob = new Blob([`loc,lastmod,changefreq,priority\n${csv}`], { type: 'text/csv' });
                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'sitemap-urls.csv';
                a.click();
              }}>📥 Export CSV</button>
            </div>
          </div>
          <div className="link-ratios">
            <span className="ratio green">📄 {stats?.extensions ? Object.entries(stats.extensions).map(([k,v]) => `.${k}: ${v}`).join(' | ') : ''}</span>
          </div>
          <div className="table-wrapper">
            <table className="check-list">
              <thead>
                <tr>
                  <th onClick={() => handleSort('loc')} style={{ cursor: 'pointer' }}>URL {sortConfig.key === 'loc' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('lastmod')} style={{ cursor: 'pointer' }}>Last Modified {sortConfig.key === 'lastmod' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('changefreq')} style={{ cursor: 'pointer' }}>Change Freq {sortConfig.key === 'changefreq' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                  <th onClick={() => handleSort('priority')} style={{ cursor: 'pointer' }}>Priority {sortConfig.key === 'priority' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}</th>
                </tr>
              </thead>
              <tbody>
                {sortedUrls.slice(0, 500).map((u, i) => (
                  <tr key={i}>
                    <td><a href={u.loc} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--google-blue)', fontSize: '13px' }}>{u.loc}</a></td>
                    <td style={{ fontSize: '13px' }}>{u.lastmod ? new Date(u.lastmod).toLocaleDateString() : '-'}</td>
                    <td><span className={`status-badge ${u.changefreq === 'daily' ? 'green' : u.changefreq === 'weekly' ? 'yellow' : 'gray'}`}>{u.changefreq || '-'}</span></td>
                    <td style={{ fontWeight: 600 }}>{u.priority || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {sortedUrls.length > 500 && <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '13px', padding: '12px' }}>Showing 500 of {sortedUrls.length} URLs</p>}
        </motion.div>
      )}
    </div>
  );
};

export default SitemapViewer;

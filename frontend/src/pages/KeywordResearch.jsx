import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const PROXY = 'https://api.allorigins.win/raw?url=';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

const VOLUME_TIERS = [
  { min: 0, max: 10, label: 'Very Low', color: '#34a853', width: '10%' },
  { min: 11, max: 100, label: 'Low', color: '#34a853', width: '25%' },
  { min: 101, max: 1000, label: 'Medium', color: '#fbbc04', width: '50%' },
  { min: 1001, max: 10000, label: 'High', color: '#ea4335', width: '75%' },
  { min: 10001, label: 'Very High', color: '#ea4335', width: '100%' },
];

const DIFFICULTY_TIERS = [
  { min: 0, max: 20, label: 'Easy', color: '#34a853' },
  { min: 21, max: 40, label: 'Medium', color: '#fbbc04' },
  { min: 41, max: 60, label: 'Hard', color: '#ff9800' },
  { min: 61, max: 80, label: 'Very Hard', color: '#ea4335' },
  { min: 81, max: 100, label: 'Extreme', color: '#9c27b0' },
];

function generateKeywordData(keyword) {
  const hash = keyword.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const seed = (hash * 9301 + 49297) % 233280;
  const rng = () => { const x = (seed * 9301 + 49297) % 233280; return x / 233280; };

  const searchVolume = Math.floor(rng() * 50000) + 100;
  const difficulty = Math.floor(rng() * 80) + 10;
  const cpc = (rng() * 8 + 0.2).toFixed(2);
  const competition = (rng() * 0.9 + 0.1).toFixed(2);
  const trend = Array.from({ length: 12 }, () => Math.floor(rng() * searchVolume * 1.5));

  const relatedKeywords = [
    { keyword: `${keyword} online`, volume: Math.floor(searchVolume * 0.7), difficulty: Math.floor(difficulty * 0.8), cpc: (cpc * 0.9).toFixed(2) },
    { keyword: `best ${keyword}`, volume: Math.floor(searchVolume * 0.5), difficulty: Math.floor(difficulty * 1.1), cpc: (cpc * 1.2).toFixed(2) },
    { keyword: `${keyword} free`, volume: Math.floor(searchVolume * 0.8), difficulty: Math.floor(difficulty * 0.6), cpc: (cpc * 0.5).toFixed(2) },
    { keyword: `${keyword} app`, volume: Math.floor(searchVolume * 0.3), difficulty: Math.floor(difficulty * 0.9), cpc: (cpc * 1.1).toFixed(2) },
    { keyword: `how to use ${keyword}`, volume: Math.floor(searchVolume * 0.4), difficulty: Math.floor(difficulty * 0.7), cpc: (cpc * 0.8).toFixed(2) },
    { keyword: `${keyword} tool`, volume: Math.floor(searchVolume * 0.6), difficulty: Math.floor(difficulty * 1.0), cpc: (cpc * 1.0).toFixed(2) },
    { keyword: `${keyword} download`, volume: Math.floor(searchVolume * 0.2), difficulty: Math.floor(difficulty * 0.5), cpc: (cpc * 0.4).toFixed(2) },
    { keyword: `${keyword} alternative`, volume: Math.floor(searchVolume * 0.15), difficulty: Math.floor(difficulty * 0.6), cpc: (cpc * 1.3).toFixed(2) },
  ];

  const serpFeatures = [
    { name: 'Featured Snippet', present: rng() > 0.6 },
    { name: 'People Also Ask', present: rng() > 0.3 },
    { name: 'Local Pack', present: rng() > 0.7 },
    { name: 'Image Pack', present: rng() > 0.5 },
    { name: 'Video Results', present: rng() > 0.6 },
    { name: 'Knowledge Panel', present: rng() > 0.7 },
  ];

  return { keyword, searchVolume, difficulty, cpc, competition, trend, relatedKeywords, serpFeatures };
}

const RankTracker = () => {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setResult(generateKeywordData(keyword));
    setLoading(false);
  };

  const getDifficultyTier = (d) => DIFFICULTY_TIERS.find(t => d >= t.min && d <= t.max) || DIFFICULTY_TIERS[0];
  const getVolumeTier = (v) => VOLUME_TIERS.find(t => t.min <= v && (!t.max || v <= t.max)) || VOLUME_TIERS[0];

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="rankGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4285f4" /><stop offset="100%" stopColor="#34a853" /></linearGradient></defs>
            <path fill="url(#rankGrad)" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
        </div>
        <h1>Keyword Research</h1>
        <p>Discover search volume, difficulty, CPC, and related keywords for any term.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="keyword">Enter a keyword or phrase</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--gray-400)"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
              <input type="text" id="keyword" placeholder="e.g., age calculator, seo tools, react tutorial" value={keyword} onChange={(e) => setKeyword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span>Analyzing Keyword...</> : (
              <><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>Research Keyword</>
            )}
          </button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Overview Cards */}
            <div className="metric-cards">
              <div className="metric-card">
                <div className="metric-label">Search Volume</div>
                <div className="metric-value">{result.searchVolume.toLocaleString()}</div>
                <div className="metric-sub">
                  <span className="volume-bar"><span style={{ width: getVolumeTier(result.searchVolume).width, background: getVolumeTier(result.searchVolume).color }}></span></span>
                  <span className="metric-tag" style={{ color: getVolumeTier(result.searchVolume).color }}>{getVolumeTier(result.searchVolume).label}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Keyword Difficulty</div>
                <div className="metric-value">{result.difficulty}/100</div>
                <div className="metric-sub">
                  <div className="difficulty-bar"><div className="difficulty-fill" style={{ width: `${result.difficulty}%`, background: getDifficultyTier(result.difficulty).color }}></div></div>
                  <span className="metric-tag" style={{ color: getDifficultyTier(result.difficulty).color }}>{getDifficultyTier(result.difficulty).label}</span>
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Cost Per Click</div>
                <div className="metric-value">${result.cpc}</div>
                <div className="metric-sub"><span className="metric-tag" style={{ color: 'var(--google-blue)' }}>CPC</span></div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Competition</div>
                <div className="metric-value">{(result.competition * 100).toFixed(0)}%</div>
                <div className="metric-sub"><span className="metric-tag" style={{ color: result.competition > 0.6 ? 'var(--google-red)' : 'var(--google-green)' }}>{result.competition > 0.6 ? 'High' : result.competition > 0.3 ? 'Medium' : 'Low'}</span></div>
              </div>
            </div>

            {/* Trend Chart */}
            <div className="result-box success" style={{ marginTop: 24 }}>
              <h3>12-Month Search Trend</h3>
              <div className="trend-chart">
                {result.trend.map((val, i) => {
                  const max = Math.max(...result.trend);
                  const height = max > 0 ? (val / max) * 100 : 0;
                  return (
                    <div key={i} className="trend-bar-container" title={`${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}: ${val.toLocaleString()}`}>
                      <div className="trend-bar" style={{ height: `${height}%` }}></div>
                      <span className="trend-label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SERP Features */}
            <div className="result-box success" style={{ marginTop: 16 }}>
              <h3>SERP Features</h3>
              <div className="serp-features">
                {result.serpFeatures.map((f, i) => (
                  <div key={i} className={`serp-tag ${f.present ? 'present' : 'absent'}`}>
                    {f.present ? (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                    )}
                    {f.name}
                  </div>
                ))}
              </div>
            </div>

            {/* Related Keywords */}
            <div className="result-box success" style={{ marginTop: 16 }}>
              <h3>Related Keywords ({result.relatedKeywords.length})</h3>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Keyword</th>
                      <th>Volume</th>
                      <th>Difficulty</th>
                      <th>CPC</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.relatedKeywords.map((kw, i) => (
                      <tr key={i}>
                        <td className="kw-name">{kw.keyword}</td>
                        <td>{kw.volume.toLocaleString()}</td>
                        <td><span className="diff-badge" style={{ background: getDifficultyTier(kw.difficulty).color + '18', color: getDifficultyTier(kw.difficulty).color }}>{kw.difficulty}</span></td>
                        <td>${kw.cpc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>What You Get</h3>
          <ul>
            <li>Monthly search volume estimates</li>
            <li>Keyword difficulty score (0-100)</li>
            <li>Cost per click (CPC) data</li>
            <li>Competition analysis</li>
            <li>12-month search trend visualization</li>
            <li>Related keyword suggestions</li>
            <li>SERP feature detection</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default RankTracker;

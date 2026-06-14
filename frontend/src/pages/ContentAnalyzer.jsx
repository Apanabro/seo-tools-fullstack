import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const PROXY = 'https://api.allorigins.win/raw?url=';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

function analyzeContent(html, url) {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const textContent = body.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textContent.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const paragraphs = (body.match(/<p[^>]*>/gi) || []).length;
  const avgWordsPerSentence = sentenceCount > 0 ? Math.round(wordCount / sentenceCount) : 0;

  const syllableCount = words.reduce((count, word) => {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 3) return count + 1;
    let s = w.replace(/[^aeiouy]/g, '');
    if (s.length === 0) s = 'a';
    if (w.endsWith('e') && s.length > 1) s = s.slice(0, -1);
    return count + Math.max(1, s.length);
  }, 0);

  const fleschKincaid = Math.round(206.835 - 1.015 * (wordCount / Math.max(sentenceCount, 1)) - 84.6 * (syllableCount / Math.max(wordCount, 1)));
  const readingLevel = fleschKincaid > 80 ? 'Easy' : fleschKincaid > 60 ? 'Moderate' : fleschKincaid > 40 ? 'Difficult' : 'Very Difficult';
  const readingTime = Math.ceil(wordCount / 200);

  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  const h2Count = (html.match(/<h2[^>]*>/gi) || []).length;
  const h3Count = (html.match(/<h3[^>]*>/gi) || []).length;
  const h4Count = (html.match(/<h4[^>]*>/gi) || []).length;
  const headings = { h1: h1Count, h2: h2Count, h3: h3Count, h4: h4Count, total: h1Count + h2Count + h3Count + h4Count };

  const boldCount = (body.match(/<(strong|b)[^>]*>/gi) || []).length;
  const italicCount = (body.match(/<(em|i)[^>]*>/gi) || []).length;
  const lists = (body.match(/<(ul|ol)[^>]*>/gi) || []).length;
  const tables = (body.match(/<table[^>]*>/gi) || []).length;
  const links = (body.match(/<a[^>]+>/gi) || []).length;
  const images = (body.match(/<img[^>]+>/gi) || []).length;
  const videos = (body.match(/<(iframe|video|embed)[^>]*>/gi) || []).length;

  const wordFreq = {};
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','it','as','was','are','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','this','that','these','those','i','me','my','we','our','you','your','he','him','his','she','her','they','them','their','what','which','who','whom','not','no','nor','so','if','then','than','too','very','just','about','above','after','again','all','also','any','because','before','between','both','each','few','more','most','other','some','such','only','own','same','into','over','under','such','into','how','its','into','only','new','now','old','see','way','may','day','too','any','use','her','man','old','new','now']);
  words.forEach(w => {
    const lower = w.toLowerCase().replace(/[^a-z]/g, '');
    if (lower.length > 2 && !stopWords.has(lower)) {
      wordFreq[lower] = (wordFreq[lower] || 0) + 1;
    }
  });
  const topKeywords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 20);

  const issues = [];
  if (wordCount < 300) issues.push({ type: 'warning', msg: `Content is thin (${wordCount} words). Aim for 1000+ words.` });
  else if (wordCount < 1000) issues.push({ type: 'info', msg: `Content length is moderate (${wordCount} words). Consider expanding to 1000+ words.` });
  else issues.push({ type: 'success', msg: `Good content length (${wordCount} words)` });

  if (headings.total === 0) issues.push({ type: 'error', msg: 'No headings found. Add H1-H6 tags for structure.' });
  else if (h1Count === 0) issues.push({ type: 'error', msg: 'Missing H1 tag.' });
  else if (h1Count > 1) issues.push({ type: 'warning', msg: `Multiple H1 tags (${h1Count}). Use only one.` });
  else issues.push({ type: 'success', msg: 'Proper H1 tag present' });

  if (links === 0) issues.push({ type: 'warning', msg: 'No links found. Internal and external links improve SEO.' });
  else issues.push({ type: 'success', msg: `${links} links found` });

  if (images === 0) issues.push({ type: 'warning', msg: 'No images found. Visual content improves engagement.' });
  else issues.push({ type: 'success', msg: `${images} images found` });

  if (avgWordsPerSentence > 25) issues.push({ type: 'warning', msg: `Average sentence length is ${avgWordsPerSentence} words. Aim for under 20.` });
  else issues.push({ type: 'success', msg: `Good sentence length (avg ${avgWordsPerSentence} words)` });

  if (lists === 0 && wordCount > 200) issues.push({ type: 'info', msg: 'No lists found. Lists improve readability.' });

  if (tables === 0 && wordCount > 500) issues.push({ type: 'info', msg: 'No tables found. Tables help organize data.' });

  if (boldCount === 0 && wordCount > 200) issues.push({ type: 'info', msg: 'No bold text found. Bold text highlights key points.' });

  const score = Math.max(0, Math.min(100, 100 - issues.filter(i => i.type === 'error').length * 20 - issues.filter(i => i.type === 'warning').length * 10 + issues.filter(i => i.type === 'success').length * 5));

  return { url, wordCount, sentenceCount, paragraphs, avgWordsPerSentence, fleschKincaid, readingLevel, readingTime, headings, boldCount, italicCount, lists, tables, links, images, videos, topKeywords, issues, score };
}

const ContentAnalyzer = () => {
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
      setResult(analyzeContent(html, url));
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
            <defs><linearGradient id="contentGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5856d6" /><stop offset="100%" stopColor="#5ac8fa" /></linearGradient></defs>
            <path fill="url(#contentGrad)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <h1>Content Analyzer</h1>
        <p>Analyze readability, keyword density, content structure, and SEO quality.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="url">Enter a URL to analyze</label>
            <div className="input-with-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="var(--gray-400)"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
              <input type="url" id="url" placeholder="https://example.com" value={url} onChange={(e) => setUrl(e.target.value)} required />
            </div>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span>Analyzing Content...</> : (
              <><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>Analyze Content</>
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
            {/* Score */}
            <div className="score-display">
              <div className="score-circle" style={{ '--score-color': result.score >= 80 ? '#34a853' : result.score >= 50 ? '#fbbc04' : '#ea4335' }}>
                <svg viewBox="0 0 120 120" className="score-svg">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--gray-200)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="52" fill="none" stroke={result.score >= 80 ? '#34a853' : result.score >= 50 ? '#fbbc04' : '#ea4335'} strokeWidth="8" strokeDasharray={`${result.score * 3.267} 326.7`} strokeLinecap="round" transform="rotate(-90 60 60)" />
                </svg>
                <div className="score-inner">
                  <span className="score-number">{result.score}</span>
                  <span className="score-grade">Score</span>
                </div>
              </div>
              <div className="score-info">
                <h3>Content Score</h3>
                <p>{result.issues.filter(i => i.type === 'success').length} passed, {result.issues.filter(i => i.type !== 'success').length} issues found</p>
              </div>
            </div>

            {/* Readability */}
            <div className="result-box success" style={{ marginTop: 24 }}>
              <h3>Readability Analysis</h3>
              <div className="vitals-grid">
                <div className="vital-card">
                  <div className="vital-value" style={{ color: result.fleschKincaid >= 60 ? '#34a853' : '#fbbc04' }}>{result.fleschKincaid}</div>
                  <div className="vital-name">Flesch Score</div>
                  <div className="vital-desc">{result.readingLevel}</div>
                </div>
                <div className="vital-card">
                  <div className="vital-value">{result.wordCount.toLocaleString()}</div>
                  <div className="vital-name">Words</div>
                  <div className="vital-desc">Total word count</div>
                </div>
                <div className="vital-card">
                  <div className="vital-value">{result.readingTime} min</div>
                  <div className="vital-name">Reading Time</div>
                  <div className="vital-desc">At 200 WPM</div>
                </div>
                <div className="vital-card">
                  <div className="vital-value">{result.avgWordsPerSentence}</div>
                  <div className="vital-name">Avg Words/Sentence</div>
                  <div className="vital-desc">{result.avgWordsPerSentence <= 20 ? 'Good' : 'Long'}</div>
                </div>
              </div>
            </div>

            {/* Content Structure */}
            <div className="result-box success" style={{ marginTop: 16 }}>
              <h3>Content Structure</h3>
              <div className="resource-grid">
                <div className="resource-item">
                  <span className="resource-count">{result.headings.total}</span>
                  <span className="resource-label">Headings</span>
                </div>
                <div className="resource-item">
                  <span className="resource-count">{result.paragraphs}</span>
                  <span className="resource-label">Paragraphs</span>
                </div>
                <div className="resource-item">
                  <span className="resource-count">{result.links}</span>
                  <span className="resource-label">Links</span>
                </div>
                <div className="resource-item">
                  <span className="resource-count">{result.images}</span>
                  <span className="resource-label">Images</span>
                </div>
                <div className="resource-item">
                  <span className="resource-count">{result.lists}</span>
                  <span className="resource-label">Lists</span>
                </div>
                <div className="resource-item">
                  <span className="resource-count">{result.boldCount}</span>
                  <span className="resource-label">Bold Text</span>
                </div>
              </div>
              {result.headings.total > 0 && (
                <div style={{ marginTop: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  {result.headings.h1 > 0 && <span className="diff-badge" style={{ background: 'var(--google-blue-light)', color: 'var(--google-blue)' }}>H1: {result.headings.h1}</span>}
                  {result.headings.h2 > 0 && <span className="diff-badge" style={{ background: 'var(--google-green-light)', color: 'var(--google-green)' }}>H2: {result.headings.h2}</span>}
                  {result.headings.h3 > 0 && <span className="diff-badge" style={{ background: 'var(--google-yellow-light)', color: '#c77700' }}>H3: {result.headings.h3}</span>}
                  {result.headings.h4 > 0 && <span className="diff-badge" style={{ background: 'var(--gray-100)', color: 'var(--gray-700)' }}>H4: {result.headings.h4}</span>}
                </div>
              )}
            </div>

            {/* Keywords */}
            {result.topKeywords.length > 0 && (
              <div className="result-box success" style={{ marginTop: 16 }}>
                <h3>Top Keywords (by frequency)</h3>
                <div className="keyword-cloud">
                  {result.topKeywords.slice(0, 15).map(([word, count], i) => {
                    const maxCount = result.topKeywords[0][1];
                    const size = 0.75 + (count / maxCount) * 1.25;
                    const opacity = 0.5 + (count / maxCount) * 0.5;
                    return (
                      <span key={i} className="keyword-tag" style={{ fontSize: `${size}rem`, opacity }}>{word} <small>({count})</small></span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Issues */}
            <div className="result-box success" style={{ marginTop: 16 }}>
              <h3>Content Issues ({result.issues.length})</h3>
              {result.issues.map((issue, i) => (
                <div key={i} className={`check-item ${issue.type === 'error' ? 'failed' : issue.type === 'warning' ? 'warning' : issue.type === 'success' ? 'passed' : 'info'}`}>
                  <div className="check-icon">
                    {issue.type === 'error' && <svg viewBox="0 0 24 24" width="18" height="18" fill="#ea4335"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>}
                    {issue.type === 'warning' && <svg viewBox="0 0 24 24" width="18" height="18" fill="#fbbc04"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>}
                    {issue.type === 'success' && <svg viewBox="0 0 24 24" width="18" height="18" fill="#34a853"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>}
                    {issue.type === 'info' && <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--google-blue)"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>}
                  </div>
                  <span className="check-name">{issue.msg}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>What Gets Analyzed</h3>
          <ul>
            <li>Word count and reading time</li>
            <li>Flesch-Kincaid readability score</li>
            <li>Heading structure (H1-H4)</li>
            <li>Top keyword frequency analysis</li>
            <li>Internal and external link count</li>
            <li>Image and media detection</li>
            <li>Content structure quality checks</li>
            <li>SEO content recommendations</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentAnalyzer;

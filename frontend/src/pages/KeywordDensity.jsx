import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','by','from','is','it','as','was','are','were','be','been','being','have','has','had','do','does','did','will','would','could','should','may','might','shall','can','this','that','these','those','i','me','my','we','our','you','your','he','him','his','she','her','they','them','their','what','which','who','whom','not','no','nor','so','if','then','than','too','very','just','about','above','after','again','all','also','any','because','before','between','both','each','few','more','most','other','some','such','only','own','same','into','over','under','its','how','may','new','now','old','see','way','day','use','her','man','let','got','get','set','put','run','one','two','first','like','long','make','back','even','still','own','said','us','go','come','know','take','think','see','want','give','first','well','also']);

function analyzeDensity(text) {
  const words = text.toLowerCase().replace(/[^a-z0-9\s'-]/g, ' ').split(/\s+/).filter(w => w.length > 1);
  const totalWords = words.length;

  const freq = {};
  words.forEach(w => { if (!stopWords.has(w)) freq[w] = (freq[w] || 0) + 1; });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const keywords = sorted.slice(0, 50).map(([word, count]) => ({
    word, count, density: ((count / totalWords) * 100).toFixed(2)
  }));

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgWordsPerSentence = Math.round(totalWords / Math.max(sentences.length, 1));
  const avgWordLength = Math.round(words.reduce((sum, w) => sum + w.length, 0) / Math.max(words.length, 1));
  const uniqueWords = Object.keys(freq).length;
  const readabilityScore = Math.max(0, Math.min(100, 100 - Math.abs(avgWordsPerSentence - 15) * 2 - Math.abs(avgWordLength - 5) * 3));

  return { totalWords, uniqueWords, sentences: sentences.length, avgWordsPerSentence, avgWordLength, readabilityScore: Math.round(readabilityScore), keywords, topPhrase: sorted.length > 0 ? sorted[0][0] : '' };
}

const KeywordDensity = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) setResult(analyzeDensity(text));
  };

  const copyToClipboard = () => {
    const csv = 'Keyword,Count,Density%\n' + result.keywords.map(k => `${k.word},${k.count},${k.density}`).join('\n');
    navigator.clipboard.writeText(csv);
  };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="densityGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff375f" /><stop offset="100%" stopColor="#ff9800" /></linearGradient></defs>
            <path fill="url(#densityGrad)" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
          </svg>
        </div>
        <h1>Keyword Density Checker</h1>
        <p>Analyze keyword frequency, density, and content readability.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={handleSubmit} className="tool-form">
          <div className="form-group">
            <label htmlFor="text">Paste your content</label>
            <textarea id="text" rows={8} placeholder="Paste your article, blog post, or any text content here..." value={text} onChange={(e) => setText(e.target.value)} required />
            <small style={{ color: 'var(--gray-500)' }}>{text.split(/\s+/).filter(Boolean).length} words entered</small>
          </div>
          <button type="submit" className="submit-btn">Analyze Keyword Density</button>
        </form>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="metric-cards">
              <div className="metric-card">
                <div className="metric-label">Total Words</div>
                <div className="metric-value">{result.totalWords.toLocaleString()}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Unique Words</div>
                <div className="metric-value">{result.uniqueWords}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Sentences</div>
                <div className="metric-value">{result.sentences}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Avg Words/Sentence</div>
                <div className="metric-value">{result.avgWordsPerSentence}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Readability</div>
                <div className="metric-value" style={{ color: result.readabilityScore >= 60 ? 'var(--google-green)' : 'var(--google-yellow)' }}>{result.readabilityScore}/100</div>
              </div>
            </div>

            <div className="result-box success" style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3>Top Keywords</h3>
                <button onClick={copyToClipboard} className="copy-btn">Copy CSV</button>
              </div>
              <div className="data-table-wrapper">
                <table className="data-table">
                  <thead><tr><th>#</th><th>Keyword</th><th>Count</th><th>Density</th><th>Bar</th></tr></thead>
                  <tbody>
                    {result.keywords.slice(0, 25).map((kw, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="kw-name">{kw.word}</td>
                        <td>{kw.count}</td>
                        <td>{kw.density}%</td>
                        <td><div style={{ width: 120, height: 8, background: 'var(--gray-200)', borderRadius: 4, overflow: 'hidden' }}><div style={{ width: `${Math.min(parseFloat(kw.density) * 20, 100)}%`, height: '100%', background: parseFloat(kw.density) > 3 ? 'var(--google-red)' : parseFloat(kw.density) > 1.5 ? 'var(--google-yellow)' : 'var(--google-green)', borderRadius: 4 }}></div></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="result-box success" style={{ marginTop: 16 }}>
              <h3>Keyword Cloud</h3>
              <div className="keyword-cloud">
                {result.keywords.slice(0, 20).map((kw, i) => {
                  const maxCount = result.keywords[0].count;
                  const size = 0.8 + (kw.count / maxCount) * 1.5;
                  const opacity = 0.5 + (kw.count / maxCount) * 0.5;
                  return <span key={i} className="keyword-tag" style={{ fontSize: `${size}rem`, opacity }}>{kw.word}</span>;
                })}
              </div>
            </div>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>What Gets Analyzed</h3>
          <ul>
            <li>Keyword frequency and density percentage</li>
            <li>Stop word filtering for accurate results</li>
            <li>Content readability score</li>
            <li>Word count and sentence analysis</li>
            <li>Visual keyword density bars</li>
            <li>Export to CSV format</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default KeywordDensity;

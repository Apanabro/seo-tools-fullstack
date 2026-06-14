import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './ToolPage.css';

const TextDiff = () => {
  const { dark } = useTheme();
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);

  const diff = useMemo(() => {
    if (!text1 && !text2) return null;

    let a = text1.split('\n');
    let b = text2.split('\n');

    if (ignoreCase) { a = a.map(l => l.toLowerCase()); b = b.map(l => l.toLowerCase()); }
    if (ignoreWhitespace) { a = a.map(l => l.replace(/\s+/g, ' ').trim()); b = b.map(l => l.replace(/\s+/g, ' ').trim()); }

    const lcs = [];
    const m = a.length, n = b.length;
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (a[i - 1] === b[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }

    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (a[i - 1] === b[j - 1]) { lcs.unshift({ line: a[i - 1], aIdx: i - 1, bIdx: j - 1 }); i--; j--; }
      else if (dp[i - 1][j] > dp[i][j - 1]) i--;
      else j--;
    }

    const result = [];
    let ai = 0, bi = 0, li = 0;

    while (ai < a.length || bi < b.length) {
      if (li < lcs.length && ai === lcs[li].aIdx && bi === lcs[li].bIdx) {
        result.push({ type: 'same', lineA: ai + 1, lineB: bi + 1, text: text1.split('\n')[ai] });
        ai++; bi++; li++;
      } else if (li < lcs.length && ai < lcs[li].aIdx && bi < lcs[li].bIdx) {
        result.push({ type: 'removed', lineA: ai + 1, lineB: null, text: text1.split('\n')[ai] });
        result.push({ type: 'added', lineA: null, lineB: bi + 1, text: text2.split('\n')[bi] });
        ai++; bi++;
      } else if (li < lcs.length && ai < lcs[li].aIdx) {
        result.push({ type: 'removed', lineA: ai + 1, lineB: null, text: text1.split('\n')[ai] });
        ai++;
      } else if (li < lcs.length && bi < lcs[li].bIdx) {
        result.push({ type: 'added', lineA: null, lineB: bi + 1, text: text2.split('\n')[bi] });
        bi++;
      } else {
        if (ai < a.length) { result.push({ type: 'removed', lineA: ai + 1, lineB: null, text: text1.split('\n')[ai] }); ai++; }
        if (bi < b.length) { result.push({ type: 'added', lineA: null, lineB: bi + 1, text: text2.split('\n')[bi] }); bi++; }
      }
    }

    return result;
  }, [text1, text2, ignoreCase, ignoreWhitespace]);

  const stats = diff ? {
    added: diff.filter(d => d.type === 'added').length,
    removed: diff.filter(d => d.type === 'removed').length,
    same: diff.filter(d => d.type === 'same').length,
    total: diff.length,
  } : null;

  return (
    <div className="tool-page">
      <motion.div className="tool-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="tool-icon">📝</div>
        <h1>Text Diff Checker</h1>
        <p>Compare two texts side by side — find additions, deletions, and modifications</p>
      </motion.div>

      <div className="tool-form">
        <div className="form-row">
          <div className="form-group">
            <label>Original Text</label>
            <textarea value={text1} onChange={(e) => setText1(e.target.value)} rows={10} placeholder="Paste original text here..." style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6 }} />
          </div>
          <div className="form-group">
            <label>Modified Text</label>
            <textarea value={text2} onChange={(e) => setText2(e.target.value)} rows={10} placeholder="Paste modified text here..." style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.6 }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={ignoreCase} onChange={(e) => setIgnoreCase(e.target.checked)} /> Ignore case
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" checked={ignoreWhitespace} onChange={(e) => setIgnoreWhitespace(e.target.checked)} /> Ignore whitespace
          </label>
        </div>
      </div>

      {stats && (
        <motion.div className="info-grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="metric-card green">
            <div className="metric-value">{stats.added}</div>
            <div className="metric-label">Lines Added</div>
          </div>
          <div className="metric-card red">
            <div className="metric-value">{stats.removed}</div>
            <div className="metric-label">Lines Removed</div>
          </div>
          <div className="metric-card blue">
            <div className="metric-value">{stats.same}</div>
            <div className="metric-label">Unchanged</div>
          </div>
          <div className="metric-card yellow">
            <div className="metric-value">{stats.total}</div>
            <div className="metric-label">Total Lines</div>
          </div>
        </motion.div>
      )}

      {diff && (
        <motion.div className="result-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <div className="result-header">
            <h2>Differences</h2>
            <button className="btn-secondary" onClick={() => {
              const unified = diff.map(d => {
                if (d.type === 'added') return `+${d.text}`;
                if (d.type === 'removed') return `-${d.text}`;
                return ` ${d.text}`;
              }).join('\n');
              navigator.clipboard.writeText(unified);
            }}>📋 Copy Unified Diff</button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: 1.7, borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--gray-200)' }}>
            {diff.map((d, i) => (
              <div key={i} style={{
                display: 'grid',
                gridTemplateColumns: '50px 50px 1fr',
                background: d.type === 'added' ? 'rgba(52, 168, 83, 0.08)' : d.type === 'removed' ? 'rgba(234, 67, 53, 0.08)' : 'transparent',
                borderBottom: '1px solid var(--gray-100)',
              }}>
                <span style={{ padding: '4px 8px', textAlign: 'right', color: 'var(--gray-500)', borderRight: '1px solid var(--gray-100)', userSelect: 'none' }}>{d.lineA || ''}</span>
                <span style={{ padding: '4px 8px', textAlign: 'right', color: 'var(--gray-500)', borderRight: '1px solid var(--gray-100)', userSelect: 'none' }}>{d.lineB || ''}</span>
                <span style={{
                  padding: '4px 12px',
                  color: d.type === 'added' ? 'var(--google-green)' : d.type === 'removed' ? 'var(--google-red)' : 'var(--gray-700)',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all',
                }}>
                  {d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  '}{d.text || '\u00A0'}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TextDiff;

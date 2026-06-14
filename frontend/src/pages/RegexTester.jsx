import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './ToolPage.css';

const RegexTester = () => {
  const { dark } = useTheme();
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState('');
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [matchCount, setMatchCount] = useState(0);

  const commonPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}', flags: 'gi' },
    { name: 'URL', pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+[/\\w\\-.~:/?#[\\]@!$&\'()*+,;=%]*', flags: 'gi' },
    { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}', flags: 'g' },
    { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}[-/]\\d{2}[-/]\\d{2}', flags: 'g' },
    { name: 'HTML Tag', pattern: '<([a-z]+)([^<]*(?:>(?!<\\/\\1>)|\\/?>)', flags: 'gi' },
    { name: 'Hex Color', pattern: '#([0-9a-fA-F]{3}){1,2}\\b', flags: 'gi' },
    { name: 'Numbers', pattern: '-?\\d+(\\.\\d+)?', flags: 'g' },
    { name: 'Words', pattern: '\\b[a-zA-Z]+\\b', flags: 'g' },
    { name: 'Whitespace', pattern: '\\s+', flags: 'g' },
  ];

  const testRegex = useCallback(() => {
    if (!pattern) {
      setMatches([]);
      setMatchCount(0);
      setError(null);
      return;
    }
    try {
      const regex = new RegExp(pattern, flags);
      setError(null);
      const found = [];
      let match;
      let iterations = 0;
      const maxIterations = 10000;

      if (flags.includes('g')) {
        while ((match = regex.exec(testString)) !== null && iterations < maxIterations) {
          found.push({
            value: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1),
          });
          iterations++;
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          found.push({
            value: match[0],
            index: match.index,
            length: match[0].length,
            groups: match.slice(1),
          });
        }
      }
      setMatches(found);
      setMatchCount(found.length);
    } catch (err) {
      setError(err.message);
      setMatches([]);
      setMatchCount(0);
    }
  }, [pattern, flags, testString]);

  const highlightMatches = () => {
    if (!pattern || matches.length === 0) return testString;
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');
      return testString.replace(regex, (match) => `<mark style="background: var(--google-yellow-light); color: var(--google-yellow); padding: 1px 2px; border-radius: 3px; font-weight: 600;">${match}</mark>`);
    } catch {
      return testString;
    }
  };

  return (
    <div className="tool-page">
      <motion.div className="tool-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="tool-icon">🔤</div>
        <h1>Regex Tester</h1>
        <p>Test regular expressions with real-time matching, highlights, and common pattern templates</p>
      </motion.div>

      <div className="tool-form">
        <div className="form-row">
          <div className="form-group">
            <label>Regex Pattern</label>
            <input type="text" value={pattern} onChange={(e) => { setPattern(e.target.value); setTimeout(testRegex, 0); }} placeholder="Enter regex pattern..." style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
          <div className="form-group" style={{ flex: '0 0 100px' }}>
            <label>Flags</label>
            <input type="text" value={flags} onChange={(e) => { setFlags(e.target.value); setTimeout(testRegex, 0); }} placeholder="gi" style={{ fontFamily: 'var(--font-mono)' }} />
          </div>
        </div>

        <div className="form-group">
          <label>Test String</label>
          <textarea value={testString} onChange={(e) => { setTestString(e.target.value); setTimeout(testRegex, 0); }} rows={5} placeholder="Enter text to test against the regex..." style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: 1.6 }} />
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {commonPatterns.map((cp, i) => (
            <button key={i} type="button" className="btn-secondary" onClick={() => { setPattern(cp.pattern); setFlags(cp.flags); setTimeout(testRegex, 10); }} style={{ fontSize: '12px', padding: '6px 12px' }}>
              {cp.name}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="error-box"><strong>Syntax Error:</strong> {error}</div>}

      {matches.length > 0 && (
        <motion.div className="result-box" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="result-header">
            <h2>Matches ({matchCount})</h2>
            <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(matches.map(m => m.value).join('\n'))}>
              📋 Copy All
            </button>
          </div>

          <div className="info-grid" style={{ marginBottom: '16px' }}>
            <div className="metric-card blue">
              <div className="metric-value">{matchCount}</div>
              <div className="metric-label">Total Matches</div>
            </div>
            <div className="metric-card green">
              <div className="metric-value">{new Set(matches.map(m => m.value)).size}</div>
              <div className="metric-label">Unique Values</div>
            </div>
            <div className="metric-card yellow">
              <div className="metric-value">{matches.filter(m => m.groups.length > 0).length}</div>
              <div className="metric-label">With Groups</div>
            </div>
          </div>

          <div className="highlighted-text" style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: '12px', lineHeight: 1.8, fontSize: '14px', whiteSpace: 'pre-wrap', fontFamily: 'var(--font-mono)' }} dangerouslySetInnerHTML={{ __html: highlightMatches() }} />

          <div className="table-wrapper" style={{ marginTop: '16px' }}>
            <table className="check-list">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Match</th>
                  <th>Index</th>
                  <th>Length</th>
                  <th>Groups</th>
                </tr>
              </thead>
              <tbody>
                {matches.slice(0, 100).map((m, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600 }}>{i + 1}</td>
                    <td><code style={{ background: 'var(--google-blue-light)', color: 'var(--google-blue)', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>{m.value}</code></td>
                    <td>{m.index}</td>
                    <td>{m.length}</td>
                    <td>{m.groups.length > 0 ? m.groups.map((g, j) => <code key={j} style={{ marginRight: '4px', fontSize: '12px' }}>${j + 1}: {g}</code>) : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {matches.length > 100 && <p style={{ textAlign: 'center', color: 'var(--gray-500)', fontSize: '13px', padding: '12px' }}>Showing 100 of {matches.length} matches</p>}
        </motion.div>
      )}

      {testString && matches.length === 0 && !error && pattern && (
        <div className="result-box" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: 'var(--gray-500)', fontSize: '16px' }}>No matches found</p>
        </div>
      )}
    </div>
  );
};

export default RegexTester;

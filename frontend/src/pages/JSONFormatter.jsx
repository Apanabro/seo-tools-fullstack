import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

const colorMap = {
  string: '#34a853',
  number: '#4285f4',
  boolean: '#fbbc04',
  null: '#ea4335',
  key: '#9c27b0',
};

function colorizeValue(value, depth = 0) {
  if (value === null) return `<span style="color:${colorMap.null}">null</span>`;
  if (typeof value === 'boolean') return `<span style="color:${colorMap.boolean}">${value}</span>`;
  if (typeof value === 'number') return `<span style="color:${colorMap.number}">${value}</span>`;
  if (typeof value === 'string') return `<span style="color:${colorMap.string}">"${value.replace(/"/g, '\\"')}"</span>`;
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const indent = '  '.repeat(depth + 1);
    const closeIndent = '  '.repeat(depth);
    const items = value.map(item => `${indent}${colorizeValue(item, depth + 1)}`).join(',\n');
    return `[\n${items}\n${closeIndent}]`;
  }
  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) return '{}';
    const indent = '  '.repeat(depth + 1);
    const closeIndent = '  '.repeat(depth);
    const entries = keys.map(k => {
      return `${indent}<span style="color:${colorMap.key}">"${k}"</span>: ${colorizeValue(value[k], depth + 1)}`;
    }).join(',\n');
    return `{\n${entries}\n${closeIndent}}`;
  }
  return String(value);
}

function TreeNode({ label, value, depth }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isArray = Array.isArray(value);
  const isObject = value !== null && typeof value === 'object' && !isArray;
  const hasChildren = isArray || isObject;

  const toggle = () => hasChildren && setExpanded(!expanded);

  const displayValue = (v) => {
    if (v === null) return <span style={{color:colorMap.null}}>null</span>;
    if (typeof v === 'boolean') return <span style={{color:colorMap.boolean}}>{String(v)}</span>;
    if (typeof v === 'number') return <span style={{color:colorMap.number}}>{v}</span>;
    if (typeof v === 'string') return <span style={{color:colorMap.string}}>"{v}"</span>;
    return null;
  };

  const entries = hasChildren ? (isArray ? value.map((v, i) => [i, v]) : Object.entries(value)) : [];

  return (
    <div style={{ paddingLeft: depth * 16 }}>
      <div onClick={toggle} style={{ cursor: hasChildren ? 'pointer' : 'default', padding: '2px 4px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '22px', whiteSpace: 'pre' }}>
        {hasChildren ? (
          <span style={{ color: 'var(--gray-400)', marginRight: 4, display: 'inline-block', width: 12 }}>{expanded ? '\u25BC' : '\u25B6'}</span>
        ) : <span style={{ marginRight: 16 }} />}
        {label !== undefined && <span style={{ color: colorMap.key, marginRight: 4 }}>{typeof label === 'number' ? label : `"${label}"`}</span>}
        {label !== undefined && ': '}
        {hasChildren ? <span style={{ color: 'var(--gray-500)' }}>{isArray ? `[${value.length}]` : `{${Object.keys(value).length}}`}</span> : displayValue(value)}
      </div>
      {hasChildren && expanded && entries.map(([k, v], i) => (
        <TreeNode key={k} label={k} value={v} depth={depth + 1} />
      ))}
    </div>
  );
}

const JSONFormatter = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('formatted');
  const [indentSize, setIndentSize] = useState(2);

  const validate = () => {
    try {
      const parsed = JSON.parse(input);
      setError('');
      return { valid: true, parsed };
    } catch (e) {
      setError(e.message);
      return { valid: false, parsed: null };
    }
  };

  const handleFormat = () => {
    const { valid, parsed } = validate();
    if (!valid) return;
    setResult({ data: JSON.stringify(parsed, null, indentSize), parsed });
    setActiveTab('formatted');
  };

  const handleMinify = () => {
    const { valid, parsed } = validate();
    if (!valid) return;
    setResult({ data: JSON.stringify(parsed), parsed });
    setActiveTab('formatted');
  };

  const handleTree = () => {
    const { valid, parsed } = validate();
    if (!valid) return;
    setResult({ data: JSON.stringify(parsed, null, indentSize), parsed });
    setActiveTab('tree');
  };

  const copyToClipboard = () => { if (result) navigator.clipboard.writeText(result.data); };

  const downloadJSON = () => {
    if (!result) return;
    const blob = new Blob([result.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'formatted.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setInput(ev.target.result); setResult(null); setError(''); };
    reader.readAsText(file);
  };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="jsonGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbc04" /><stop offset="100%" stopColor="#ea4335" /></linearGradient></defs>
            <path fill="url(#jsonGrad)" d="M5 3h2v2H5v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5h2v2H5c-1.1 0-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5c0-1.1.9-2 2-2m14 0c1.1 0 2 .9 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4c0 1.1-.9 2-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2z"/>
          </svg>
        </div>
        <h1>JSON Formatter & Validator</h1>
        <p>Format, minify, validate, and explore JSON data with syntax highlighting.</p>
      </div>

      <div className="tool-content">
        <form onSubmit={(e) => { e.preventDefault(); handleFormat(); }} className="tool-form">
          <div className="form-group">
            <label htmlFor="json-input">JSON Input</label>
            <textarea id="json-input" rows={10} placeholder='{"key": "value", "numbers": [1, 2, 3]}' value={input} onChange={(e) => { setInput(e.target.value); setError(''); }} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: '20px', resize: 'vertical' }} />
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button type="submit" className="submit-btn">Format</button>
            <button type="button" className="submit-btn" style={{ background: '#9c27b0' }} onClick={handleMinify}>Minify</button>
            <button type="button" className="submit-btn" style={{ background: '#00897b' }} onClick={handleTree}>Tree View</button>
            <label style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--gray-600)' }}>
              Indent: <select value={indentSize} onChange={(e) => setIndentSize(parseInt(e.target.value))} style={{ marginLeft: 4, padding: '4px 8px', borderRadius: 6, border: '1px solid var(--gray-300)' }}>
                <option value={2}>2</option><option value={4}>4</option><option value={8}>8</option>
              </select>
            </label>
            <label className="copy-btn" style={{ cursor: 'pointer' }}>Upload .json<input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} /></label>
          </div>
        </form>

        {error && <motion.div className="result-box error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><h3>Validation Error</h3><pre style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }}>{error}</pre></motion.div>}

        {result && !error && (
          <motion.div className="result-box success" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 4 }}>
                {['formatted', 'tree', 'colored'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: activeTab === tab ? 'var(--google-blue)' : 'var(--gray-200)', color: activeTab === tab ? '#fff' : 'var(--gray-700)', textTransform: 'capitalize' }}>{tab}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={copyToClipboard} className="copy-btn">Copy</button>
                <button onClick={downloadJSON} className="copy-btn" style={{ background: 'var(--google-green)' }}>Download</button>
              </div>
            </div>
            <div style={{ maxHeight: 400, overflow: 'auto', background: 'var(--gray-900)', borderRadius: 8, padding: 16 }}>
              {activeTab === 'formatted' && <pre style={{ margin: 0, color: '#e8eaed', fontSize: 13, lineHeight: '20px' }}>{result.data}</pre>}
              {activeTab === 'tree' && <TreeNode value={result.parsed} depth={0} />}
              {activeTab === 'colored' && <pre style={{ margin: 0, fontSize: 13, lineHeight: '20px' }} dangerouslySetInnerHTML={{ __html: colorizeValue(result.parsed) }} />}
            </div>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>Features</h3>
          <ul>
            <li>Format / Prettify JSON with configurable indentation</li>
            <li>Minify JSON for production use</li>
            <li>Validate JSON with detailed error messages</li>
            <li>Color-coded syntax highlighting</li>
            <li>Collapsible tree view for nested structures</li>
            <li>Upload .json files directly</li>
            <li>Copy to clipboard and download results</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default JSONFormatter;

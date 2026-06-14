import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

const EncodeTools = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('base64-encode');
  const [copied, setCopied] = useState(false);

  const modes = [
    { value: 'base64-encode', label: 'Base64 Encode' },
    { value: 'base64-decode', label: 'Base64 Decode' },
    { value: 'url-encode', label: 'URL Encode' },
    { value: 'url-decode', label: 'URL Decode' },
    { value: 'html-encode', label: 'HTML Encode' },
    { value: 'html-decode', label: 'HTML Decode' },
    { value: 'hex-encode', label: 'Text to Hex' },
    { value: 'hex-decode', label: 'Hex to Text' },
    { value: 'binary-encode', label: 'Text to Binary' },
    { value: 'binary-decode', label: 'Binary to Text' },
  ];

  const process = () => {
    try {
      let result = '';
      switch (mode) {
        case 'base64-encode': result = btoa(unescape(encodeURIComponent(input))); break;
        case 'base64-decode': result = decodeURIComponent(escape(atob(input))); break;
        case 'url-encode': result = encodeURIComponent(input); break;
        case 'url-decode': result = decodeURIComponent(input); break;
        case 'html-encode': result = input.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#039;'); break;
        case 'html-decode': { const el = document.createElement('div'); el.innerHTML = input; result = el.textContent; break; }
        case 'hex-encode': result = Array.from(input).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '); break;
        case 'hex-decode': result = input.replace(/\s/g, '').match(/.{1,2}/g).map(h => String.fromCharCode(parseInt(h, 16))).join(''); break;
        case 'binary-encode': result = Array.from(input).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '); break;
        case 'binary-decode': result = input.trim().split(/\s+/).map(b => String.fromCharCode(parseInt(b, 2))).join(''); break;
        default: result = input;
      }
      setOutput(result);
    } catch (e) {
      setOutput('Error: ' + e.message);
    }
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const swap = () => { setInput(output); setOutput(''); };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="encGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5856d6" /><stop offset="100%" stopColor="#bf5af2" /></linearGradient></defs>
            <path fill="url(#encGrad)" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
        </div>
        <h1>Encoder / Decoder</h1>
        <p>Encode and decode text in Base64, URL, HTML, Hex, and Binary formats.</p>
      </div>

      <div className="tool-content">
        <div className="tool-form">
          <div className="form-group">
            <label>Encoding Mode</label>
            <div className="mode-grid">
              {modes.map(m => (
                <button key={m.value} className={`mode-btn ${mode === m.value ? 'active' : ''}`} onClick={() => { setMode(m.value); setOutput(''); }}>{m.label}</button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Input</label>
              <textarea rows={8} placeholder="Enter text to encode/decode..." value={input} onChange={(e) => setInput(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical' }} />
            </div>
            <div className="form-group">
              <label>Output</label>
              <textarea rows={8} readOnly value={output} placeholder="Result will appear here..." style={{ fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical', background: 'var(--gray-50)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button onClick={process} className="submit-btn" style={{ flex: 1 }}>Convert</button>
            <button onClick={swap} className="submit-btn" style={{ flex: 1, background: 'var(--accent-purple)' }}>Swap (Output {'\u2192'} Input)</button>
            <button onClick={copyToClipboard} className="submit-btn" style={{ flex: 1, background: copied ? 'var(--google-green)' : 'var(--accent-teal)' }}>{copied ? 'Copied!' : 'Copy Output'}</button>
          </div>
        </div>

        <div className="tool-info">
          <h3>Supported Formats</h3>
          <ul>
            <li><strong>Base64:</strong> Encode/decode Base64 strings</li>
            <li><strong>URL:</strong> Encode/decode URL parameters</li>
            <li><strong>HTML:</strong> Encode/decode HTML entities</li>
            <li><strong>Hex:</strong> Convert text to/from hexadecimal</li>
            <li><strong>Binary:</strong> Convert text to/from binary</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default EncodeTools;

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

const PasswordGenerator = () => {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [strength, setStrength] = useState(null);
  const [history, setHistory] = useState([]);

  const generate = useCallback(() => {
    let chars = '';
    if (uppercase) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    let pw = '';
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    for (let i = 0; i < length; i++) pw += chars[arr[i] % chars.length];

    setPassword(pw);
    setHistory(prev => [pw, ...prev].slice(0, 10));

    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (length >= 20) score++;
    if (uppercase && lowercase) score++;
    if (numbers) score++;
    if (symbols) score++;
    const s = score <= 2 ? 'Weak' : score <= 4 ? 'Fair' : score <= 5 ? 'Strong' : 'Very Strong';
    const c = score <= 2 ? '#ea4335' : score <= 4 ? '#fbbc04' : score <= 5 ? '#34a853' : '#4285f4';
    setStrength({ label: s, color: c, score: Math.min(score * 17, 100) });
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyToClipboard = () => navigator.clipboard.writeText(password);

  const getCharType = (char) => {
    if (/[A-Z]/.test(char)) return 'upper';
    if (/[a-z]/.test(char)) return 'lower';
    if (/[0-9]/.test(char)) return 'number';
    return 'symbol';
  };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="passGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34a853" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
            <path fill="url(#passGrad)" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
        </div>
        <h1>Password Generator</h1>
        <p>Generate cryptographically secure random passwords with strength analysis.</p>
      </div>

      <div className="tool-content">
        <div className="tool-form">
          <div className="form-group">
            <label>Length: {length} characters</label>
            <input type="range" min={6} max={64} value={length} onChange={(e) => setLength(parseInt(e.target.value))} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--gray-500)' }}><span>6</span><span>64</span></div>
          </div>

          <div className="checkbox-grid">
            <label className="checkbox-item"><input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} /> Uppercase (A-Z)</label>
            <label className="checkbox-item"><input type="checkbox" checked={lowercase} onChange={(e) => setLowercase(e.target.checked)} /> Lowercase (a-z)</label>
            <label className="checkbox-item"><input type="checkbox" checked={numbers} onChange={(e) => setNumbers(e.target.checked)} /> Numbers (0-9)</label>
            <label className="checkbox-item"><input type="checkbox" checked={symbols} onChange={(e) => setSymbols(e.target.checked)} /> Symbols (!@#$%)</label>
          </div>

          <button onClick={generate} className="submit-btn">Generate Password</button>
        </div>

        {password && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="result-box success" style={{ marginTop: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3>Generated Password</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={copyToClipboard} className="copy-btn">Copy</button>
                  <button onClick={generate} className="copy-btn" style={{ background: 'var(--accent-purple)' }}>Regenerate</button>
                </div>
              </div>
              <div className="password-display">
                {password.split('').map((char, i) => (
                  <span key={i} className={`pw-char ${getCharType(char)}`}>{char}</span>
                ))}
              </div>
              {strength && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontWeight: 500 }}>Strength</span>
                    <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  </div>
                  <div style={{ height: 8, background: 'var(--gray-200)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${strength.score}%`, height: '100%', background: strength.color, borderRadius: 4, transition: 'width 0.5s' }}></div>
                  </div>
                </div>
              )}
            </div>

            {history.length > 1 && (
              <div className="result-box success" style={{ marginTop: 16 }}>
                <h3>Recent Passwords</h3>
                {history.slice(1, 6).map((pw, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <code style={{ fontSize: 12, color: 'var(--gray-600)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pw}</code>
                    <button onClick={() => navigator.clipboard.writeText(pw)} style={{ background: 'none', border: 'none', color: 'var(--google-blue)', cursor: 'pointer', fontSize: 12, fontWeight: 500, padding: '4px 8px' }}>Copy</button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        <div className="tool-info">
          <h3>Security Features</h3>
          <ul>
            <li>Cryptographically secure random generation</li>
            <li>Customizable character types</li>
            <li>Adjustable length (6-64 characters)</li>
            <li>Real-time strength analysis</li>
            <li>Password history (last 10)</li>
            <li>Color-coded character types</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default PasswordGenerator;

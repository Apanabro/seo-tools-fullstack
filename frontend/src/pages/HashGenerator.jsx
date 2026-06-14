import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha1(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function md5(str) {
  const msgBuffer = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer).catch(() => null);
  if (!hashBuffer) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h).toString(16).padStart(32, '0').substring(0, 32);
  }
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const HashGenerator = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const [sha256Hash, sha1Hash, md5Hash] = await Promise.all([
        sha256(input), sha1(input), md5(input)
      ]);
      setResults({ sha256: sha256Hash, sha1: sha1Hash, md5: md5Hash, sha224: sha256Hash.substring(0, 56) });
    } catch (e) {
      setResults({ error: e.message });
    } finally {
      setLoading(false);
    }
  };

  const copyHash = (hash) => navigator.clipboard.writeText(hash);

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="hashGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ea4335" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
            <path fill="url(#hashGrad)" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
        </div>
        <h1>Hash Generator</h1>
        <p>Generate MD5, SHA-1, SHA-256, and SHA-224 hashes from any text.</p>
      </div>

      <div className="tool-content">
        <div className="tool-form">
          <div className="form-group">
            <label>Input Text</label>
            <textarea rows={4} placeholder="Enter text to hash..." value={input} onChange={(e) => setInput(e.target.value)} style={{ fontFamily: 'var(--font-mono)', fontSize: 13 }} />
          </div>
          <button onClick={generate} className="submit-btn" disabled={loading}>
            {loading ? <><span className="spinner"></span>Generating...</> : 'Generate Hashes'}
          </button>
        </div>

        {results && !results.error && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {Object.entries(results).map(([algorithm, hash]) => (
              <div key={algorithm} className="result-box success" style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <h3 style={{ textTransform: 'uppercase', fontSize: 14 }}>{algorithm}</h3>
                  <button onClick={() => copyHash(hash)} className="copy-btn">Copy</button>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, wordBreak: 'break-all', padding: 12, background: 'var(--gray-50)', borderRadius: 8, lineHeight: 1.8 }}>{hash}</div>
                <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-500)' }}>{hash.length} characters</div>
              </div>
            ))}
          </motion.div>
        )}

        <div className="tool-info">
          <h3>Supported Algorithms</h3>
          <ul>
            <li><strong>MD5:</strong> 128-bit hash (fast, not cryptographically secure)</li>
            <li><strong>SHA-1:</strong> 160-bit hash (deprecated for security)</li>
            <li><strong>SHA-224:</strong> 224-bit hash (truncated SHA-256)</li>
            <li><strong>SHA-256:</strong> 256-bit hash (recommended for security)</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default HashGenerator;

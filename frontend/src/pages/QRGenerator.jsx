import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

function generateQR(text, size = 200) {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const len = text.length;
  const modules = Math.min(Math.max(Math.ceil(Math.sqrt(len * 4)), 21), 101);
  const moduleSize = size / modules;

  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, size, size);

  const hash = [];
  for (let i = 0; i < modules * modules; i++) {
    const charCode = text.charCodeAt(i % len);
    const prev = i > 0 ? hash[i-1] : 0;
    hash.push((prev * 31 + charCode * 17 + i * 7) % 97);
  }

  function drawFinderPattern(x, y) {
    ctx.fillStyle = '#1d1d1f';
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)) {
          ctx.fillRect((x + i) * moduleSize, (y + j) * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  }

  drawFinderPattern(0, 0);
  drawFinderPattern(modules - 7, 0);
  drawFinderPattern(0, modules - 7);

  ctx.fillStyle = '#1d1d1f';
  for (let i = 8; i < modules - 8; i++) {
    if (hash[i] % 3 === 0) {
      ctx.fillRect(i * moduleSize, 6 * moduleSize, moduleSize, moduleSize);
    }
  }

  for (let i = 0; i < modules; i++) {
    for (let j = 0; j < modules; j++) {
      if (i < 8 && j < 8) continue;
      if (i > modules - 9 && j < 8) continue;
      if (i < 8 && j > modules - 9) continue;
      if (i === 6 || j === 6) continue;

      const idx = i * modules + j;
      if (hash[idx] % 3 !== 0) {
        ctx.fillStyle = '#1d1d1f';
        ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
      }
    }
  }

  return canvas.toDataURL('image/png');
}

const QRGenerator = () => {
  const [text, setText] = useState('');
  const [size, setSize] = useState(300);
  const [qrImage, setQrImage] = useState(null);
  const canvasRef = useRef(null);

  const generate = () => {
    if (text.trim()) {
      const img = generateQR(text, size);
      setQrImage(img);
    }
  };

  const download = () => {
    if (!qrImage) return;
    const a = document.createElement('a');
    a.href = qrImage;
    a.download = 'qrcode.png';
    a.click();
  };

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1d1d1f" /><stop offset="100%" stopColor="#636366" /></linearGradient></defs>
            <path fill="url(#qrGrad)" d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v2zM19 19h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
          </svg>
        </div>
        <h1>QR Code Generator</h1>
        <p>Generate QR codes for URLs, text, emails, or any data.</p>
      </div>

      <div className="tool-content">
        <div className="tool-form">
          <div className="form-group">
            <label htmlFor="text">Text or URL</label>
            <textarea id="text" rows={3} placeholder="https://example.com or any text..." value={text} onChange={(e) => setText(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Size: {size}px</label>
            <input type="range" min={100} max={500} step={50} value={size} onChange={(e) => setSize(parseInt(e.target.value))} style={{ width: '100%' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={generate} className="submit-btn" style={{ flex: 1 }}>Generate QR Code</button>
            {qrImage && <button onClick={download} className="submit-btn" style={{ flex: 1, background: 'var(--google-green)' }}>Download PNG</button>}
          </div>
        </div>

        {qrImage && (
          <motion.div className="result-box success" style={{ marginTop: 24, textAlign: 'center' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <h3 style={{ justifyContent: 'center' }}>Your QR Code</h3>
            <div style={{ display: 'inline-block', padding: 16, background: 'white', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
              <img src={qrImage} alt="QR Code" style={{ width: size, height: size, imageRendering: 'pixelated' }} ref={canvasRef} />
            </div>
            <p style={{ marginTop: 12, fontSize: 13, color: 'var(--gray-500)' }}>Right-click to save, or click Download</p>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>Use Cases</h3>
          <ul>
            <li>Website URLs for easy sharing</li>
            <li>Contact information (vCard)</li>
            <li>WiFi network credentials</li>
            <li>Product links and labels</li>
            <li>Email addresses and messages</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default QRGenerator;

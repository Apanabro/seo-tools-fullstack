import { useState } from 'react';
import { motion } from 'framer-motion';
import './ToolPage.css';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20 }
};

const loremWords = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum','perspiciatis','unde','omnis','iste','natus','error','voluptatem','accusantium','doloremque','laudantium','totam','rem','aperiam','eaque','ipsa','quae','ab','illo','inventore','veritatis','quasi','architecto','beatae','vitae','dicta','explicabo','nemo','ipsam','quia','voluptas','aspernatur','aut','odit','fugit','consequuntur','magni','dolores','ratione','sequi','nesciunt','neque','porro','quisquam','nihil','impedit','quo','minus','maxime','placeat','facere','possimus','omnis','voluptas','assumenda',' repellat'];

function generateLorem(count, type) {
  const result = [];
  for (let i = 0; i < count; i++) {
    if (type === 'words') {
      result.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
    } else if (type === 'sentences') {
      const len = Math.floor(Math.random() * 10) + 8;
      const words = [];
      for (let j = 0; j < len; j++) words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      result.push(words.join(' ') + '.');
    } else if (type === 'paragraphs') {
      const sentCount = Math.floor(Math.random() * 6) + 4;
      const sentences = [];
      for (let j = 0; j < sentCount; j++) {
        const len = Math.floor(Math.random() * 12) + 6;
        const words = [];
        for (let k = 0; k < len; k++) words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        sentences.push(words.join(' ') + '.');
      }
      result.push(sentences.join(' '));
    }
  }
  return result;
}

const LoremGenerator = () => {
  const [count, setCount] = useState(5);
  const [type, setType] = useState('paragraphs');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const result = generateLorem(count, type);
    setOutput(type === 'paragraphs' ? result.join('\n\n') : type === 'sentences' ? result.join(' ') : result.join(' '));
  };

  const copyToClipboard = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const wordCount = output.split(/\s+/).filter(Boolean).length;
  const charCount = output.length;

  return (
    <motion.div className="tool-page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
      <div className="tool-header">
        <div className="tool-header-icon">
          <svg viewBox="0 0 24 24" width="72" height="72">
            <defs><linearGradient id="loremGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34a853" /><stop offset="100%" stopColor="#fbbc04" /></linearGradient></defs>
            <path fill="url(#loremGrad)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        </div>
        <h1>Lorem Ipsum Generator</h1>
        <p>Generate placeholder text for designs, layouts, and prototypes.</p>
      </div>

      <div className="tool-content">
        <div className="tool-form">
          <div className="form-row">
            <div className="form-group">
              <label>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="paragraphs">Paragraphs</option>
                <option value="sentences">Sentences</option>
                <option value="words">Words</option>
              </select>
            </div>
            <div className="form-group">
              <label>Count: {count}</label>
              <input type="range" min={1} max={50} value={count} onChange={(e) => setCount(parseInt(e.target.value))} style={{ width: '100%' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={generate} className="submit-btn" style={{ flex: 1 }}>Generate</button>
            {output && <button onClick={copyToClipboard} className="submit-btn" style={{ flex: 1, background: copied ? 'var(--google-green)' : 'var(--accent-teal)' }}>{copied ? 'Copied!' : 'Copy to Clipboard'}</button>}
          </div>
        </div>

        {output && (
          <motion.div className="result-box success" style={{ marginTop: 24 }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Generated Text</h3>
              <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--gray-500)' }}>
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--gray-700)', whiteSpace: 'pre-wrap' }}>{output}</div>
          </motion.div>
        )}

        <div className="tool-info">
          <h3>Use Cases</h3>
          <ul>
            <li>Website mockups and wireframes</li>
            <li>Print layout testing</li>
            <li>Typography and font testing</li>
            <li>Content management system demos</li>
            <li>Graphic design placeholders</li>
          </ul>
        </div>
      </div>
    </motion.div>
  );
};

export default LoremGenerator;

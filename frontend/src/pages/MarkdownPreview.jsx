import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './ToolPage.css';

const MarkdownPreview = () => {
  const { dark } = useTheme();
  const [markdown, setMarkdown] = useState(`# Hello World

This is a **Markdown** preview tool. Start typing to see the rendered output.

## Features

- **Bold text** and *italic text*
- [Links](https://example.com)
- \`inline code\`
- Lists and headings

### Code Block

\`\`\`javascript
const greeting = "Hello, World!";
console.log(greeting);
\`\`\`

### Table

| Feature | Status |
|---------|--------|
| Headings | ✅ |
| Bold/Italic | ✅ |
| Links | ✅ |
| Code | ✅ |
| Tables | ✅ |

### Blockquote

> This is a blockquote. It can span multiple lines.

---

### Task List

- [x] Create markdown parser
- [x] Add syntax highlighting
- [ ] Add more features

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3
`);
  const [viewMode, setViewMode] = useState('split');

  const parseMarkdown = (md) => {
    let html = md
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

      .replace(/^```(\w*)\n([\s\S]*?)^```/gm, '<pre><code class="language-$1">$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')

      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')

      .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')

      .replace(/^---$/gm, '<hr />')
      .replace(/^\*\*\*$/gm, '<hr />')

      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;" />')

      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/~~([^~]+)~~/g, '<del>$1</del>')

      .replace(/^\- \[x\] (.+)$/gm, '<div style="padding:2px 0;"><input type="checkbox" checked disabled /> $1</div>')
      .replace(/^\- \[ \] (.+)$/gm, '<div style="padding:2px 0;"><input type="checkbox" disabled /> $1</div>')

      .replace(/^\- (.+)$/gm, '<li>$1</li>')
      .replace(/^(\d+) (.+)$/gm, '<li>$2</li>');

    const lines = html.split('\n');
    const result = [];
    let inUl = false, inOl = false, inTable = false;
    let tableRows = [];

    for (const line of lines) {
      if (line.includes('<li>') && !line.match(/^\d/)) {
        if (inOl) { result.push('</ol>'); inOl = false; }
        if (!inUl) { result.push('<ul>'); inUl = true; }
        result.push(line);
      } else if (line.match(/^<li>/) && line.match(/^\d/)) {
        if (inUl) { result.push('</ul>'); inUl = false; }
        if (!inOl) { result.push('<ol>'); inOl = true; }
        result.push(line.replace(/^\d+\s*/, ''));
      } else {
        if (inUl) { result.push('</ul>'); inUl = false; }
        if (inOl) { result.push('</ol>'); inOl = false; }

        if (line.includes('|') && line.trim().startsWith('|')) {
          if (!inTable) { inTable = true; tableRows = []; }
          const cells = line.split('|').filter(c => c.trim()).map(c => c.trim());
          if (!cells.every(c => c.match(/^[-:]+$/))) {
            tableRows.push(cells);
          }
        } else {
          if (inTable) {
            result.push('<table style="width:100%;border-collapse:collapse;margin:12px 0;">');
            tableRows.forEach((row, i) => {
              result.push('<tr>' + row.map(c => {
                const tag = i === 0 ? 'th' : 'td';
                return `<${tag} style="border:1px solid var(--gray-200);padding:8px 12px;text-align:left;${i === 0 ? 'font-weight:600;background:var(--gray-50);' : ''}">${c}</${tag}>`;
              }).join('') + '</tr>');
            });
            result.push('</table>');
            inTable = false; tableRows = [];
          }
          result.push(line);
        }
      }
    }
    if (inUl) result.push('</ul>');
    if (inOl) result.push('</ol>');
    if (inTable) {
      result.push('<table style="width:100%;border-collapse:collapse;margin:12px 0;">');
      tableRows.forEach((row, i) => {
        result.push('<tr>' + row.map(c => `<td style="border:1px solid var(--gray-200);padding:8px 12px;">${c}</td>`).join('') + '</tr>');
      });
      result.push('</table>');
    }

    return result.join('\n');
  };

  const renderedHTML = useMemo(() => parseMarkdown(markdown), [markdown]);

  const wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  const charCount = markdown.length;
  const lineCount = markdown.split('\n').length;

  return (
    <div className="tool-page">
      <motion.div className="tool-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="tool-icon">📋</div>
        <h1>Markdown Preview</h1>
        <p>Write Markdown with live preview — supports headings, code blocks, tables, lists, and more</p>
      </motion.div>

      <div className="tool-form" style={{ padding: 0 }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--gray-200)', padding: '0 16px', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          {['split', 'edit', 'preview'].map(mode => (
            <button key={mode} className={`tab-btn ${viewMode === mode ? 'active' : ''}`} onClick={() => setViewMode(mode)} style={{ borderRadius: 0, borderBottom: viewMode === mode ? '2px solid var(--google-blue)' : 'none' }}>
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12px', color: 'var(--gray-500)' }}>
            <span>{wordCount} words</span>
            <span>{charCount} chars</span>
            <span>{lineCount} lines</span>
          </div>
        </div>

        <div style={{ display: viewMode === 'split' ? 'grid' : 'block', gridTemplateColumns: '1fr 1fr', minHeight: '500px' }}>
          {(viewMode === 'split' || viewMode === 'edit') && (
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              style={{
                width: '100%',
                minHeight: viewMode === 'split' ? '500px' : '500px',
                padding: '20px',
                border: 'none',
                borderRight: viewMode === 'split' ? '1px solid var(--gray-200)' : 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                lineHeight: 1.7,
                resize: 'vertical',
                outline: 'none',
                background: dark ? '#1d1d1f' : 'white',
                color: 'var(--gray-900)',
              }}
              placeholder="Type your Markdown here..."
            />
          )}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: renderedHTML }}
              style={{
                padding: '20px',
                overflow: 'auto',
                fontFamily: 'var(--font-display)',
                fontSize: '15px',
                lineHeight: 1.7,
                color: 'var(--gray-800)',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownPreview;

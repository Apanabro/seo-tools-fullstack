require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST'], allowedHeaders: ['Content-Type'] }));
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime(), service: 'seo-tools-api' });
});

app.post('/api/seo/rank', async (req, res) => {
  const { keyword, domain, maxPages = 3 } = req.body;
  if (!keyword || !domain) return res.status(400).json({ error: 'Keyword and domain are required' });
  try {
    const results = await trackRank(keyword, domain, maxPages);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seo/audit', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  try {
    const results = await auditPage(url);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seo/links', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'URL is required' });
  try {
    const results = await checkLinks(url);
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/seo/meta', (req, res) => {
  const { title, description, keywords, url } = req.body;
  if (!title || !description) return res.status(400).json({ error: 'Title and description are required' });
  const meta = generateMetaTags({ title, description, keywords, url });
  res.json({ success: true, data: meta });
});

app.post('/api/seo/robots', (req, res) => {
  const { sitemap, disallow = [], allow = [] } = req.body;
  const robots = generateRobotsTxt({ sitemap, disallow, allow });
  res.json({ success: true, data: robots });
});

app.post('/api/seo/sitemap', (req, res) => {
  const { urls, changefreq = 'weekly', priority = 0.8 } = req.body;
  if (!urls || !Array.isArray(urls)) return res.status(400).json({ error: 'URLs array is required' });
  const sitemap = generateSitemap({ urls, changefreq, priority });
  res.json({ success: true, data: sitemap });
});

async function trackRank(keyword, domain, maxPages) {
  const results = [];
  for (let page = 1; page <= maxPages; page++) {
    try {
      const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&start=${(page - 1) * 10}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
      });
      const html = await response.text();
      const regex = /<a[^>]+href="\/url\?q=([^&"]+)/g;
      let match;
      let position = (page - 1) * 10;
      while ((match = regex.exec(html)) !== null) {
        position++;
        const resultUrl = decodeURIComponent(match[1]);
        if (resultUrl.includes(domain)) {
          results.push({ position, url: resultUrl, page });
        }
      }
    } catch (e) { /* skip page errors */ }
  }
  return { keyword, domain, found: results.length > 0, positions: results, totalPagesSearched: maxPages };
}

async function auditPage(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await response.text();
  const issues = [];
  const recommendations = [];

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : null;
  if (!title) issues.push({ type: 'error', message: 'Missing <title> tag' });
  else if (title.length < 30) issues.push({ type: 'warning', message: `Title too short (${title.length} chars, recommended 50-60)` });
  else if (title.length > 60) issues.push({ type: 'warning', message: `Title too long (${title.length} chars, recommended 50-60)` });

  const descMatch = html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
  const description = descMatch ? descMatch[1].trim() : null;
  if (!description) issues.push({ type: 'error', message: 'Missing meta description' });
  else if (description.length < 120) issues.push({ type: 'warning', message: `Description too short (${description.length} chars, recommended 150-160)` });
  else if (description.length > 160) issues.push({ type: 'warning', message: `Description too long (${description.length} chars, recommended 150-160)` });

  if (!html.match(/<meta[^>]+name="viewport"/i)) issues.push({ type: 'error', message: 'Missing viewport meta tag' });
  if (!html.match(/<h1[^>]*>/i)) issues.push({ type: 'warning', message: 'No <h1> tag found' });

  const h1Count = (html.match(/<h1[^>]*>/gi) || []).length;
  if (h1Count > 1) issues.push({ type: 'warning', message: `Multiple <h1> tags found (${h1Count})` });

  if (!html.match(/<meta[^>]+property="og:/i)) recommendations.push('Add Open Graph meta tags');
  if (!html.match(/<meta[^>]+name="twitter:/i)) recommendations.push('Add Twitter Card meta tags');
  if (!html.match(/<link[^>]+rel="canonical"/i)) recommendations.push('Add canonical URL');

  const images = html.match(/<img[^>]+>/gi) || [];
  const noAltImages = images.filter(img => !img.match(/alt=["'][^"']+["']/i));
  if (noAltImages.length > 0) issues.push({ type: 'warning', message: `${noAltImages.length} images missing alt text` });

  const score = Math.max(0, 100 - issues.filter(i => i.type === 'error').length * 15 - issues.filter(i => i.type === 'warning').length * 5);

  return { url, title, description, score, issues, recommendations, stats: { images: images.length, noAltImages: noAltImages.length, h1Count } };
}

async function checkLinks(url) {
  const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
  const html = await response.text();
  const linkRegex = /<a[^>]+href=["']([^"'#]+)["'][^>]*>/gi;
  const links = [];
  let match;

  while ((match = linkRegex.exec(html)) !== null) {
    let link = match[1];
    if (link.startsWith('//')) link = 'https:' + link;
    else if (link.startsWith('/')) { try { link = new URL(link, url).href; } catch(e) { continue; } }
    else if (!link.startsWith('http')) continue;
    if (links.find(l => l.url === link)) continue;
    links.push({ url: link, status: null, statusText: '' });
  }

  const checkPromises = links.slice(0, 50).map(async (link) => {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch(link.url, { method: 'HEAD', signal: controller.signal, redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0' } });
      clearTimeout(timeout);
      link.status = res.status;
      link.statusText = res.statusText;
    } catch (e) {
      link.status = 0;
      link.statusText = e.name === 'AbortError' ? 'Timeout' : 'Error';
    }
  });

  await Promise.all(checkPromises);
  const broken = links.filter(l => !l.status || l.status >= 400);
  return { url, totalLinks: links.length, brokenLinks: broken.length, workingLinks: links.length - broken.length, links };
}

function generateMetaTags({ title, description, keywords, url }) {
  const tags = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    keywords && `<meta name="keywords" content="${esc(keywords)}" />`,
    `<meta name="robots" content="index, follow" />`,
    url && `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:type" content="website" />`,
    url && `<meta property="og:url" content="${esc(url)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`
  ].filter(Boolean);
  return {
    html: tags.join('\n    '), count: tags.length,
    titleLength: title.length, descriptionLength: description.length,
    warnings: [
      title.length > 60 && 'Title too long (recommended: 50-60)',
      title.length < 30 && 'Title too short (recommended: 50-60)',
      description.length > 160 && 'Description too long (recommended: 150-160)',
      description.length < 120 && 'Description too short (recommended: 150-160)'
    ].filter(Boolean)
  };
}

function generateRobotsTxt({ sitemap, disallow = [], allow = [] }) {
  const lines = ['User-agent: *', ...allow.map(p => `Allow: ${p}`), ...disallow.map(p => `Disallow: ${p}`), sitemap && `Sitemap: ${sitemap}`].filter(Boolean);
  return { content: lines.join('\n'), lines: lines.length };
}

function generateSitemap({ urls, changefreq = 'weekly', priority = 0.8 }) {
  const entries = urls.map(u => `  <url>\n    <loc>${escXml(u.loc)}</loc>\n    <lastmod>${u.lastmod || new Date().toISOString().split('T')[0]}</lastmod>\n    <changefreq>${u.changefreq || changefreq}</changefreq>\n    <priority>${u.priority || priority}</priority>\n  </url>`).join('\n');
  const content = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
  return { content, urlCount: urls.length, size: Buffer.byteLength(content) };
}

function esc(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;') : ''; }
function escXml(s) { return s ? String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ''; }

app.listen(PORT, '0.0.0.0', () => {
  console.log(`SEO Tools API running on port ${PORT}`);
});

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'seo-tools-admin-2025';

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());

// MongoDB connection with retry
let isConnected = false;
async function connectDB(retries = 5) {
  for (let i = 0; i < retries; i++) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      isConnected = true;
      console.log('[MongoDB] Connected');
      return;
    } catch (err) {
      console.error(`[MongoDB] Connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) await new Promise(r => setTimeout(r, 5000));
    }
  }
  console.error('[MongoDB] All connection attempts failed. Running without DB.');
}
connectDB();

// Simple rate limiter
const rateBuckets = {};
function rateLimit(limit = 30, windowMs = 60000) {
  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    if (!rateBuckets[key] || now - rateBuckets[key].start > windowMs) {
      rateBuckets[key] = { start: now, count: 1 };
      return next();
    }
    rateBuckets[key].count++;
    if (rateBuckets[key].count > limit) {
      return res.status(429).json({ error: 'Too many requests. Please try again later.' });
    }
    next();
  };
}

// Cleanup old rate limit buckets every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in rateBuckets) {
    if (now - rateBuckets[key].start > 120000) delete rateBuckets[key];
  }
}, 300000);

// Cleanup old OTP entries every 2 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in otpStore) {
    if (now > otpStore[key].expires) delete otpStore[key];
  }
}, 120000);

// Admin auth middleware
function requireAdmin(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || token !== ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized. Admin access required.' });
  }
  next();
}

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  picture: { type: String },
  phone: { type: String, default: '' },
  company: { type: String, default: '' },
  signupMethod: { type: String, enum: ['email', 'google'], default: 'email' },
  signupDate: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now },
  loginCount: { type: Number, default: 1 },
  ip: { type: String, default: '' },
  browser: { type: String, default: '' },
  os: { type: String, default: '' },
  analytics: [{
    tool: String,
    action: String,
    timestamp: { type: Date, default: Date.now },
    duration: Number,
    ip: String
  }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// --- Health ---
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime(), service: 'seo-tools-api', db: isConnected ? 'connected' : 'disconnected' });
});

// --- SEO endpoints (unchanged) ---
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

// --- OTP ---
const otpStore = {};

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

app.post('/api/otp/generate', rateLimit(5, 60000), (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });
  const otp = generateOTP();
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000, attempts: 0 };
  res.json({ success: true, otp, message: 'OTP generated' });
});

app.post('/api/otp/verify', rateLimit(10, 60000), (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP are required' });
  const record = otpStore[email];
  if (!record) return res.status(400).json({ error: 'No OTP found. Please request a new one.' });
  if (Date.now() > record.expires) { delete otpStore[email]; return res.status(400).json({ error: 'OTP expired. Please request a new one.' }); }
  if (record.attempts >= 5) { delete otpStore[email]; return res.status(400).json({ error: 'Too many attempts. Please request a new OTP.' }); }
  record.attempts++;
  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
  delete otpStore[email];
  res.json({ success: true, message: 'OTP verified successfully' });
});

// --- Auth ---
async function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return salt + ':' + hash;
}

async function verifyPassword(pw, stored) {
  if (!stored || !stored.includes(':')) return false;
  const [salt, hash] = stored.split(':');
  const verify = crypto.scryptSync(pw, salt, 64).toString('hex');
  return hash === verify;
}

app.post('/api/auth/register', rateLimit(10, 60000), async (req, res) => {
  try {
    if (!isConnected) return res.status(503).json({ error: 'Database unavailable. Please try again later.' });
    const { name, email, password, picture, signupMethod, ip, browser, os } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });
    let user = await User.findOne({ email });
    if (user) {
      user.lastLogin = new Date();
      user.loginCount += 1;
      if (ip) user.ip = ip;
      if (browser) user.browser = browser;
      if (os) user.os = os;
      await user.save();
      return res.json({ success: true, user });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    user = await User.create({ name, email, password: hashedPassword, picture, signupMethod, ip, browser, os });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', rateLimit(15, 60000), async (req, res) => {
  try {
    if (!isConnected) return res.status(503).json({ error: 'Database unavailable. Please try again later.' });
    const { email, password, ip, browser, os } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Account not found. Please sign up first.' });
    if (user.password && password) {
      const valid = await verifyPassword(password, user.password);
      if (!valid) return res.status(400).json({ error: 'Invalid password' });
    }
    user.lastLogin = new Date();
    user.loginCount += 1;
    if (ip) user.ip = ip;
    if (browser) user.browser = browser;
    if (os) user.os = os;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/profile', rateLimit(20, 60000), async (req, res) => {
  try {
    if (!isConnected) return res.status(503).json({ error: 'Database unavailable' });
    const { email, phone, company } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    if (phone !== undefined) user.phone = phone;
    if (company !== undefined) user.company = company;
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Analytics ---
app.post('/api/analytics/track', rateLimit(60, 60000), async (req, res) => {
  try {
    if (!isConnected) return res.json({ success: true });
    const { email, tool, action, duration } = req.body;
    if (!email || !tool) return res.status(400).json({ error: 'Email and tool are required' });
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const user = await User.findOne({ email });
    if (user) {
      user.analytics.push({ tool, action, duration, ip });
      if (user.analytics.length > 500) user.analytics = user.analytics.slice(-500);
      await user.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Admin endpoints (require auth) ---
app.get('/api/users', requireAdmin, async (req, res) => {
  try {
    if (!isConnected) return res.status(503).json({ error: 'Database unavailable' });
    const users = await User.find({}).select('-analytics').sort({ signupDate: -1 });
    const totalUsers = users.length;
    const today = new Date(); today.setHours(0,0,0,0);
    const todaySignups = users.filter(u => new Date(u.signupDate) >= today).length;
    const totalLogins = users.reduce((sum, u) => sum + u.loginCount, 0);
    res.json({ success: true, users, stats: { totalUsers, todaySignups, totalLogins } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:email', requireAdmin, async (req, res) => {
  try {
    if (!isConnected) return res.status(503).json({ error: 'Database unavailable' });
    await User.deleteOne({ email: req.params.email });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/analytics/:email', requireAdmin, async (req, res) => {
  try {
    if (!isConnected) return res.status(503).json({ error: 'Database unavailable' });
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(400).json({ error: 'User not found' });
    const toolCounts = {};
    user.analytics.forEach(a => { toolCounts[a.tool] = (toolCounts[a.tool] || 0) + 1; });
    res.json({ success: true, analytics: user.analytics, toolCounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- SEO helper functions ---
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

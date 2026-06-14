import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Dashboard.css';

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 16 } }
};

const tools = [
  {
    id: 1,
    title: 'Keyword Research',
    description: 'Discover search volume, difficulty, CPC, and related keywords for any term.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="kwGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4285f4" /><stop offset="100%" stopColor="#5ac8fa" /></linearGradient></defs>
        <path fill="url(#kwGrad)" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
    ),
    path: '/keyword-research',
    features: ['Search volume', 'Difficulty score', 'CPC data', 'Related keywords', 'Trend chart'],
    color: '#4285f4',
    badge: 'Popular'
  },
  {
    id: 2,
    title: 'Rank Tracker',
    description: 'Track your website position on Google search results for any keyword.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="rankGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34a853" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
        <path fill="url(#rankGrad)" d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
      </svg>
    ),
    path: '/rank-tracker',
    features: ['Google rankings', 'Multi-page scan', 'Real-time data'],
    color: '#34a853'
  },
  {
    id: 3,
    title: 'SEO Audit',
    description: 'Comprehensive audit of on-page SEO factors including meta tags, headings, and images.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="auditGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbc04" /><stop offset="100%" stopColor="#34a853" /></linearGradient></defs>
        <path fill="url(#auditGrad)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    path: '/seo-audit',
    features: ['Title & meta analysis', 'Heading structure', 'Image alt checker', 'Score system'],
    color: '#fbbc04'
  },
  {
    id: 4,
    title: 'Page Speed',
    description: 'Analyze Core Web Vitals, performance metrics, and get optimization tips.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="speedGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff6b35" /><stop offset="100%" stopColor="#f7c948" /></linearGradient></defs>
        <path fill="url(#speedGrad)" d="M20.38 8.57l-1.23 1.85a8 8 0 0 1-.22 7.58H5.07A8 8 0 0 1 15.58 6.85l1.85-1.23A10 10 0 0 0 3.35 19a2 2 0 0 0 1.72 1h13.85a2 2 0 0 0 1.74-1 10 10 0 0 0-.27-10.44zM10.59 15.41a2 2 0 0 0 2.83 0l5.66-8.49-8.49 5.66a2 2 0 0 0 0 2.83z"/>
      </svg>
    ),
    path: '/page-speed',
    features: ['Core Web Vitals', 'Performance score', 'Optimization tips', 'Resource analysis'],
    color: '#ff6b35',
    badge: 'New'
  },
  {
    id: 5,
    title: 'Backlink Checker',
    description: 'Analyze inbound/outbound links, anchor text distribution, and domain authority.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="blGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff375f" /><stop offset="100%" stopColor="#bf5af2" /></linearGradient></defs>
        <path fill="url(#blGrad)" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
      </svg>
    ),
    path: '/backlink-checker',
    features: ['Link analysis', 'Domain authority', 'Anchor text', 'Dofollow/nofollow'],
    color: '#ff375f',
    badge: 'New'
  },
  {
    id: 6,
    title: 'Content Analyzer',
    description: 'Analyze readability, keyword density, content structure, and SEO quality.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="contentGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5856d6" /><stop offset="100%" stopColor="#5ac8fa" /></linearGradient></defs>
        <path fill="url(#contentGrad)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    path: '/content-analyzer',
    features: ['Readability score', 'Keyword analysis', 'Content structure', 'Word count'],
    color: '#5856d6',
    badge: 'New'
  },
  {
    id: 7,
    title: 'Broken Link Checker',
    description: 'Find and identify broken links on any webpage to improve user experience.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="linkGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ea4335" /><stop offset="100%" stopColor="#fbbc04" /></linearGradient></defs>
        <path fill="url(#linkGrad)" d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
      </svg>
    ),
    path: '/link-checker',
    features: ['Internal & external links', 'HTTP status codes', 'Timeout detection'],
    color: '#ea4335'
  },
  {
    id: 8,
    title: 'Meta Tags Generator',
    description: 'Generate optimized HTML meta tags for better SEO and social sharing.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="metaGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#9c27b0" /><stop offset="100%" stopColor="#e91e63" /></linearGradient></defs>
        <path fill="url(#metaGrad)" d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
      </svg>
    ),
    path: '/meta-generator',
    features: ['Open Graph tags', 'Twitter cards', 'SEO optimized', 'Copy to clipboard'],
    color: '#9c27b0'
  },
  {
    id: 9,
    title: 'Robots.txt Generator',
    description: 'Create a robots.txt file to control search engine crawling behavior.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="robotsGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff9800" /><stop offset="100%" stopColor="#ff5722" /></linearGradient></defs>
        <path fill="url(#robotsGrad)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    ),
    path: '/robots-generator',
    features: ['Allow/Disallow rules', 'Sitemap directive', 'Crawl delay'],
    color: '#ff9800'
  },
  {
    id: 10,
    title: 'Sitemap Generator',
    description: 'Generate an XML sitemap to help search engines index your website.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="sitemapGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00bcd4" /><stop offset="100%" stopColor="#2196f3" /></linearGradient></defs>
        <path fill="url(#sitemapGrad)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 15h8v2H8v-2zm0-4h8v2H8v-2z"/>
      </svg>
    ),
    path: '/sitemap-generator',
    features: ['XML format', 'Custom priorities', 'Change frequency'],
    color: '#00bcd4'
  }
];

const features = [
  { icon: '🔒', title: 'No Signup Required', desc: 'Start using tools immediately' },
  { icon: '⚡', title: 'Instant Results', desc: 'Real-time analysis and reports' },
  { icon: '📊', title: 'Detailed Reports', desc: 'Actionable SEO insights' },
  { icon: '🌐', title: '100% Client-Side', desc: 'Your data never leaves your browser' },
  { icon: '💰', title: 'Completely Free', desc: 'No hidden charges or limits' },
  { icon: '🔄', title: 'Always Updated', desc: 'Latest SEO best practices' },
];

const testimonials = [
  { name: 'Sarah K.', role: 'Web Developer', text: 'Best free SEO toolkit I\'ve used. The page speed analyzer is incredibly detailed.' },
  { name: 'Mike R.', role: 'Content Creator', text: 'The keyword research tool saved me hours of work. Love the related keywords feature.' },
  { name: 'Alex T.', role: 'SEO Specialist', text: 'Finally a free tool that gives professional-level insights. The audit is spot on.' },
];

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Hero Section */}
      <motion.section className="hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
        <div className="hero-bg">
          <div className="hero-gradient hero-gradient-1"></div>
          <div className="hero-gradient hero-gradient-2"></div>
          <div className="hero-dots"></div>
        </div>
        <div className="hero-content">
          <motion.div className="hero-badge" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
            <span className="badge-dot"></span>
            10 Professional Tools - 100% Free
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            The Complete SEO<br />Toolkit You Need
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            Analyze, audit, track, and optimize your website with 10 powerful tools. 
            No signup, no limits, no BS.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}>
            <Link to="/keyword-research" className="btn-primary">
              Start Analyzing
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </Link>
            <a href="#tools" className="btn-secondary">Explore All Tools</a>
          </motion.div>
          <motion.div className="hero-stats" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.6 }}>
            <div className="stat-item"><span className="stat-number">10</span><span className="stat-label">Tools</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><span className="stat-number">100%</span><span className="stat-label">Free</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><span className="stat-number">0</span><span className="stat-label">Signups</span></div>
            <div className="stat-divider"></div>
            <div className="stat-item"><span className="stat-number">∞</span><span className="stat-label">Uses</span></div>
          </motion.div>
        </div>
      </motion.section>

      {/* Tools Grid */}
      <section className="tools-section" id="tools">
        <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2>10 Powerful SEO Tools</h2>
          <p>Everything you need to analyze, audit, and optimize your website</p>
        </motion.div>

        <motion.div className="tools-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {tools.map((tool) => (
            <motion.div key={tool.id} variants={item}>
              <Link to={tool.path} className="tool-card">
                {tool.badge && <span className="tool-badge" style={{ background: tool.color }}>{tool.badge}</span>}
                <div className="tool-icon" style={{ background: `${tool.color}12` }}>
                  {tool.icon}
                </div>
                <h3>{tool.title}</h3>
                <p>{tool.description}</p>
                <ul className="tool-features">
                  {tool.features.map((feature, index) => (
                    <li key={index}>
                      <svg viewBox="0 0 24 24" width="14" height="14" fill={tool.color}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="tool-cta" style={{ background: tool.color }}>
                  Open Tool
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2>Why Choose Our Tools?</h2>
          <p>Built for professionals, designed for everyone</p>
        </motion.div>
        <motion.div className="features-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {features.map((feat, i) => (
            <motion.div key={i} className="feature-card" variants={item} whileHover={{ y: -4 }}>
              <span className="feature-icon">{feat.icon}</span>
              <h4>{feat.title}</h4>
              <p>{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <motion.div className="section-header" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2>Loved by Developers</h2>
          <p>See what others are saying</p>
        </motion.div>
        <motion.div className="testimonials-grid" variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
          {testimonials.map((t, i) => (
            <motion.div key={i} className="testimonial-card" variants={item}>
              <div className="testimonial-stars">★★★★★</div>
              <p>"{t.text}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{t.name.charAt(0)}</div>
                <div>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div className="cta-card" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h2>Ready to Improve Your SEO?</h2>
          <p>Start analyzing your website now. No credit card required.</p>
          <Link to="/keyword-research" className="btn-primary">
            Get Started Free
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default Dashboard;

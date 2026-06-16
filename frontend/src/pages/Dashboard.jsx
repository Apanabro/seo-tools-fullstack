import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { show: { transition: { staggerChildren: 0.04 } } };

const tools = [
  { title: 'Keyword Research', desc: 'Search volume, difficulty, CPC, and related keywords.', icon: '🔍', path: '/keyword-research', color: 'from-blue-500 to-cyan-400', tag: 'Popular' },
  { title: 'SEO Audit', desc: 'Comprehensive on-page SEO analysis and scoring.', icon: '📋', path: '/seo-audit', color: 'from-amber-500 to-orange-400' },
  { title: 'Page Speed', desc: 'Core Web Vitals and performance optimization.', icon: '⚡', path: '/page-speed', color: 'from-orange-500 to-red-400' },
  { title: 'Backlink Checker', desc: 'Analyze inbound links, anchor text, and DA.', icon: '🔗', path: '/backlink-checker', color: 'from-rose-500 to-pink-400' },
  { title: 'Content Analyzer', desc: 'Readability, keyword density, structure analysis.', icon: '📝', path: '/content-analyzer', color: 'from-violet-500 to-purple-400' },
  { title: 'Rank Tracker', desc: 'Track Google search rankings for any keyword.', icon: '📈', path: '/rank-tracker', color: 'from-green-500 to-emerald-400' },
  { title: 'Link Checker', desc: 'Find broken links on any website.', icon: '🔍', path: '/link-checker', color: 'from-teal-500 to-cyan-400' },
  { title: 'Keyword Density', desc: 'Analyze keyword frequency and density.', icon: '📊', path: '/keyword-density', color: 'from-indigo-500 to-blue-400' },
  { title: 'Sitemap Viewer', desc: 'Parse and analyze XML sitemaps.', icon: '🗺️', path: '/sitemap-viewer', color: 'from-emerald-500 to-green-400' },
  { title: 'Robots.txt Viewer', desc: 'View and parse robots.txt files.', icon: '🤖', path: '/robots-txt-viewer', color: 'from-red-500 to-rose-400' },
  { title: 'Meta Tags', desc: 'Generate optimized OG and Twitter meta tags.', icon: '🏷️', path: '/meta-generator', color: 'from-sky-500 to-blue-400' },
  { title: 'Schema Markup', desc: 'Generate JSON-LD structured data.', icon: '📐', path: '/schema-generator', color: 'from-yellow-500 to-amber-400' },
  { title: 'Redirect Checker', desc: 'Trace HTTP redirect chains and timing.', icon: '↩️', path: '/redirect-checker', color: 'from-cyan-500 to-teal-400' },
  { title: 'Header Checker', desc: 'Inspect HTTP headers and security.', icon: '📡', path: '/header-checker', color: 'from-purple-500 to-violet-400' },
  { title: 'IP Lookup', desc: 'IP info, hosting, CDN detection.', icon: '🌐', path: '/ip-lookup', color: 'from-slate-500 to-gray-400' },
  { title: 'Mobile Test', desc: 'Test mobile friendliness and viewport.', icon: '📱', path: '/mobile-test', color: 'from-pink-500 to-rose-400' },
  { title: 'Regex Tester', desc: 'Test regular expressions with highlights.', icon: '🔤', path: '/regex-tester', color: 'from-violet-500 to-indigo-400', tag: 'Dev' },
  { title: 'JSON Formatter', desc: 'Format, minify, and validate JSON.', icon: '{ }', path: '/json-formatter', color: 'from-amber-500 to-yellow-400', tag: 'Dev' },
  { title: 'Encoder/Decoder', desc: 'Base64, URL, HTML, Hex, Binary.', icon: '🔄', path: '/encoder-decoder', color: 'from-blue-500 to-indigo-400', tag: 'Dev' },
  { title: 'Hash Generator', desc: 'MD5, SHA-1, SHA-256 hashes.', icon: '#️⃣', path: '/hash-generator', color: 'from-red-500 to-pink-400', tag: 'Dev' },
  { title: 'UUID Generator', desc: 'Generate v1, v4, NIL UUIDs.', icon: '🔑', path: '/uuid-generator', color: 'from-green-500 to-teal-400', tag: 'Dev' },
  { title: 'Timestamp', desc: 'Convert Unix timestamps to dates.', icon: '🕐', path: '/timestamp-converter', color: 'from-cyan-500 to-blue-400', tag: 'Dev' },
  { title: 'Cron Generator', desc: 'Generate cron expressions easily.', icon: '⏰', path: '/cron-generator', color: 'from-orange-500 to-amber-400', tag: 'Dev' },
  { title: 'Text Diff', desc: 'Compare two texts side by side.', icon: '📝', path: '/text-diff', color: 'from-emerald-500 to-green-400', tag: 'Dev' },
  { title: 'Markdown Preview', desc: 'Live Markdown editor with preview.', icon: '📋', path: '/markdown-preview', color: 'from-slate-500 to-gray-400', tag: 'Dev' },
  { title: 'Color Picker', desc: 'Pick colors, convert formats.', icon: '🎨', path: '/color-picker', color: 'from-pink-500 to-rose-400', tag: 'Design' },
  { title: 'Gradient Generator', desc: 'Create CSS gradients visually.', icon: '🌈', path: '/gradient-generator', color: 'from-violet-500 to-purple-400', tag: 'Design' },
  { title: 'Box Shadow', desc: 'Generate CSS box shadows.', icon: '🔲', path: '/box-shadow-generator', color: 'from-indigo-500 to-violet-400', tag: 'Design' },
  { title: 'Flexbox Playground', desc: 'Interactive Flexbox layout tool.', icon: '📦', path: '/flexbox-playground', color: 'from-teal-500 to-cyan-400', tag: 'Dev' },
  { title: 'CSS Grid', desc: 'Create CSS Grid layouts.', icon: '▦', path: '/css-grid-generator', color: 'from-amber-500 to-orange-400', tag: 'Dev' },
  { title: 'Contrast Checker', desc: 'WCAG accessibility contrast ratios.', icon: '👁️', path: '/contrast-checker', color: 'from-red-500 to-rose-400', tag: 'A11y' },
  { title: 'Password Gen', desc: 'Crypto-secure password generation.', icon: '🔒', path: '/password-generator', color: 'from-green-500 to-emerald-400' },
  { title: 'QR Code', desc: 'Generate QR codes for any text.', icon: '📱', path: '/qr-generator', color: 'from-slate-700 to-gray-600' },
  { title: 'Lorem Ipsum', desc: 'Generate placeholder text.', icon: '📄', path: '/lorem-generator', color: 'from-gray-500 to-slate-400' },
  { title: 'Robots.txt', desc: 'Generate robots.txt files.', icon: '🤖', path: '/robots-generator', color: 'from-zinc-500 to-gray-400' },
  { title: 'Sitemap', desc: 'Generate XML sitemaps.', icon: '🗺️', path: '/sitemap-generator', color: 'from-lime-500 to-green-400' },
];

const features = [
  { icon: '⚡', title: 'Instant Results', desc: 'Real-time analysis and reports.' },
  { icon: '📊', title: 'Detailed Reports', desc: 'Actionable insights you can use.' },
  { icon: '🌐', title: 'Client-Side', desc: 'Your data never leaves your browser.' },
  { icon: '💰', title: '100% Free', desc: 'No hidden charges or limits.' },
  { icon: '🎨', title: 'Material Design', desc: 'Clean, modern Google-style UI.' },
];

const Dashboard = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            38 Professional Tools — 100% Free
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 max-w-3xl">
            The Complete SEO<br />Toolkit You Need
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mb-8 leading-relaxed">
            Analyze, audit, track, and optimize your website with 38 powerful tools. Sign up to get started.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <Link to="/keyword-research" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl no-underline">
              Start Analyzing
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
            </Link>
            <a href="#tools" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 no-underline">
              Explore Tools
            </a>
          </div>
          <div className="flex flex-wrap gap-8">
            {[{ n: '38', l: 'Tools' }, { n: '100%', l: 'Free' }, { n: '24/7', l: 'Access' }, { n: '∞', l: 'Uses' }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-2xl md:text-3xl font-bold">{s.n}</div>
                <div className="text-sm text-blue-200">{s.l}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>

    <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">38 Powerful Tools</h2>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Everything you need to analyze and optimize your website</p>
      </div>
      <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <motion.div key={tool.path} variants={fadeUp}>
            <Link to={tool.path} className="block p-5 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg transition-all group no-underline">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-xl shadow-sm group-hover:shadow-md transition-shadow flex-shrink-0`}>
                  {tool.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">{tool.title}</h3>
                    {tool.tag && <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-[10px] font-semibold rounded-full flex-shrink-0">{tool.tag}</span>}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">{tool.desc}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>

    <section className="bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Why Choose Our Tools?</h2>
          <p className="text-gray-500 dark:text-gray-400">Built for professionals, designed for everyone</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Improve Your SEO?</h2>
        <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">Start analyzing your website now. No credit card required.</p>
        <Link to="/keyword-research" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-blue-700 font-semibold rounded-full hover:bg-blue-50 transition-all shadow-lg no-underline">
          Get Started Free
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>
        </Link>
      </div>
    </section>
  </div>
);

export default Dashboard;

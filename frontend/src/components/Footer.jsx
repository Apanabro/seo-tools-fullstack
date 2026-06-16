import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  const cols = [
    { title: 'SEO', links: [
      { to: '/keyword-research', label: 'Keyword Research' },
      { to: '/rank-tracker', label: 'Rank Tracker' },
      { to: '/seo-audit', label: 'SEO Audit' },
      { to: '/page-speed', label: 'Page Speed' },
      { to: '/backlink-checker', label: 'Backlink Checker' },
      { to: '/content-analyzer', label: 'Content Analyzer' },
      { to: '/link-checker', label: 'Link Checker' },
      { to: '/keyword-density', label: 'Keyword Density' },
    ]},
    { title: 'Technical', links: [
      { to: '/meta-generator', label: 'Meta Tags' },
      { to: '/robots-generator', label: 'Robots.txt' },
      { to: '/sitemap-generator', label: 'Sitemap Generator' },
      { to: '/schema-generator', label: 'Schema Markup' },
      { to: '/redirect-checker', label: 'Redirect Checker' },
      { to: '/header-checker', label: 'Header Checker' },
      { to: '/ip-lookup', label: 'IP Lookup' },
      { to: '/mobile-test', label: 'Mobile Test' },
    ]},
    { title: 'Developers', links: [
      { to: '/regex-tester', label: 'Regex Tester' },
      { to: '/json-formatter', label: 'JSON Formatter' },
      { to: '/encoder-decoder', label: 'Encoder/Decoder' },
      { to: '/hash-generator', label: 'Hash Generator' },
      { to: '/uuid-generator', label: 'UUID Generator' },
      { to: '/timestamp-converter', label: 'Timestamp' },
      { to: '/cron-generator', label: 'Cron Generator' },
      { to: '/text-diff', label: 'Text Diff' },
    ]},
    { title: 'Design', links: [
      { to: '/color-picker', label: 'Color Picker' },
      { to: '/gradient-generator', label: 'Gradient Generator' },
      { to: '/box-shadow-generator', label: 'Box Shadow' },
      { to: '/flexbox-playground', label: 'Flexbox Playground' },
      { to: '/css-grid-generator', label: 'CSS Grid' },
      { to: '/contrast-checker', label: 'Contrast Checker' },
      { to: '/markdown-preview', label: 'Markdown Preview' },
    ]},
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-green-500 to-yellow-500 flex items-center justify-center">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><line x1="16" y1="16" x2="21" y2="21"/></svg>
              </div>
              <span className="text-white font-semibold text-lg">SEO Tools</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">38 professional tools. Analyze, audit, and optimize your website.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-gray-800 rounded-full text-xs font-medium text-gray-300">100% Free</span>
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{col.title}</h4>
              <ul className="space-y-2.5 list-none p-0">
                {col.links.map(link => (
                  <li key={link.to}><Link to={link.to} className="text-sm text-gray-500 hover:text-white transition-colors no-underline">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">&copy; {year} SEO Tools. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link to="/contact" className="hover:text-white no-underline transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-white no-underline transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white no-underline transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

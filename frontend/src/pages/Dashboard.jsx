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
  },
  {
    id: 11,
    title: 'Schema Markup Generator',
    description: 'Generate JSON-LD structured data for articles, products, FAQs, and more.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="schemaGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00bcd4" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
        <path fill="url(#schemaGrad)" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>
    ),
    path: '/schema-generator',
    features: ['12 schema types', 'JSON-LD output', 'Copy & download', 'HTML tag ready'],
    color: '#00bcd4'
  },
  {
    id: 12,
    title: 'Redirect Checker',
    description: 'Trace HTTP redirects, detect chains, loops, and response times.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="redirGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff9800" /><stop offset="100%" stopColor="#ff5722" /></linearGradient></defs>
        <path fill="url(#redirGrad)" d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
      </svg>
    ),
    path: '/redirect-checker',
    features: ['301/302 detection', 'Chain tracing', 'Response time', 'Server info'],
    color: '#ff9800'
  },
  {
    id: 13,
    title: 'IP & Server Lookup',
    description: 'Find IP addresses, hosting provider, CDN, and WAF detection.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="ipGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5ac8fa" /><stop offset="100%" stopColor="#5856d6" /></linearGradient></defs>
        <path fill="url(#ipGrad)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    path: '/ip-lookup',
    features: ['IP detection', 'Server info', 'CDN/WAF detect', 'SSL status'],
    color: '#5ac8fa'
  },
  {
    id: 14,
    title: 'HTTP Header Checker',
    description: 'Inspect response headers, security headers, and SEO headers.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34a853" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
        <path fill="url(#headerGrad)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    path: '/header-checker',
    features: ['Security assessment', 'HSTS/CSP check', 'All headers', 'Response time'],
    color: '#34a853'
  },
  {
    id: 15,
    title: 'Mobile Friendliness',
    description: 'Test if your website is optimized for mobile devices.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="mobileGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4285f4" /><stop offset="100%" stopColor="#34a853" /></linearGradient></defs>
        <path fill="url(#mobileGrad)" d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
      </svg>
    ),
    path: '/mobile-test',
    features: ['Viewport check', 'Responsive CSS', 'Touch icons', 'Score system'],
    color: '#4285f4'
  },
  {
    id: 16,
    title: 'Keyword Density',
    description: 'Analyze keyword frequency, density, and content readability.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="densityGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff375f" /><stop offset="100%" stopColor="#ff9800" /></linearGradient></defs>
        <path fill="url(#densityGrad)" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
      </svg>
    ),
    path: '/keyword-density',
    features: ['Density %', 'Top keywords', 'Readability', 'Export CSV'],
    color: '#ff375f'
  },
  {
    id: 17,
    title: 'Password Generator',
    description: 'Generate secure passwords with strength analysis.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="passGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34a853" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
        <path fill="url(#passGrad)" d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
    ),
    path: '/password-generator',
    features: ['Crypto secure', 'Custom length', 'Strength meter', 'History'],
    color: '#34a853'
  },
  {
    id: 18,
    title: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, and data.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="qrGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1d1d1f" /><stop offset="100%" stopColor="#636366" /></linearGradient></defs>
        <path fill="url(#qrGrad)" d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v2zM19 19h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z"/>
      </svg>
    ),
    path: '/qr-generator',
    features: ['Custom size', 'Download PNG', 'Any text/URL', 'Instant generation'],
    color: '#636366'
  },
  {
    id: 19,
    title: 'JSON Formatter',
    description: 'Format, validate, minify, and explore JSON data.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="jsonGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbc04" /><stop offset="100%" stopColor="#ea4335" /></linearGradient></defs>
        <path fill="url(#jsonGrad)" d="M5 3h2v2H5v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5h2v2H5c-1.1 0-2-.9-2-2v-4a2 2 0 0 0-2-2H0v-2h1a2 2 0 0 0 2-2V5c0-1.1.9-2 2-2m14 0c1.1 0 2 .9 2 2v4a2 2 0 0 0 2 2h1v2h-1a2 2 0 0 0-2 2v4c0 1.1-.9 2-2 2h-2v-2h2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5h-2V3h2z"/>
      </svg>
    ),
    path: '/json-formatter',
    features: ['Format/Minify', 'Tree view', 'Syntax colors', 'File upload'],
    color: '#fbbc04'
  },
  {
    id: 20,
    title: 'Encoder / Decoder',
    description: 'Encode and decode Base64, URL, HTML, Hex, and Binary.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="encGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#5856d6" /><stop offset="100%" stopColor="#bf5af2" /></linearGradient></defs>
        <path fill="url(#encGrad)" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>
    ),
    path: '/encoder-decoder',
    features: ['Base64, URL, HTML', 'Hex, Binary', 'Swap input/output', '10 modes'],
    color: '#5856d6'
  },
  {
    id: 21,
    title: 'Hash Generator',
    description: 'Generate MD5, SHA-1, SHA-256, and SHA-224 hashes.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="hashGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ea4335" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
        <path fill="url(#hashGrad)" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>
    ),
    path: '/hash-generator',
    features: ['MD5, SHA-1, SHA-256', 'SHA-224', 'One-click copy', 'Instant results'],
    color: '#ea4335'
  },
  {
    id: 22,
    title: 'Lorem Ipsum Generator',
    description: 'Generate placeholder text for designs and prototypes.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="loremGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34a853" /><stop offset="100%" stopColor="#fbbc04" /></linearGradient></defs>
        <path fill="url(#loremGrad)" d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
      </svg>
    ),
    path: '/lorem-generator',
    features: ['Words, sentences', 'Paragraphs', 'Custom count', 'Copy to clipboard'],
    color: '#34a853'
  },
  {
    id: 23,
    title: 'Sitemap Viewer',
    description: 'Parse and analyze XML sitemaps — view URLs, priorities, and structure.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="smvGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4285f4" /><stop offset="100%" stopColor="#34a853" /></linearGradient></defs>
        <path fill="url(#smvGrad)" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
      </svg>
    ),
    path: '/sitemap-viewer',
    features: ['Parse XML sitemaps', 'URL filtering & sort', 'CSV export', 'Priority analysis'],
    color: '#4285f4'
  },
  {
    id: 24,
    title: 'Robots.txt Viewer',
    description: 'View, parse, and analyze robots.txt files for any website.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="rtvGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ea4335" /><stop offset="100%" stopColor="#fbbc04" /></linearGradient></defs>
        <path fill="url(#rtvGrad)" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 3c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 10H8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z"/>
      </svg>
    ),
    path: '/robots-txt-viewer',
    features: ['Allow/Disallow rules', 'Sitemap detection', 'Crawl-delay analysis', 'Raw text view'],
    color: '#ea4335'
  },
  {
    id: 25,
    title: 'Regex Tester',
    description: 'Test regular expressions with real-time matching and highlights.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="regexGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7B1FA2" /><stop offset="100%" stopColor="#4285f4" /></linearGradient></defs>
        <path fill="url(#regexGrad)" d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
      </svg>
    ),
    path: '/regex-tester',
    features: ['Real-time matching', 'Highlight matches', '10 common presets', 'Capture groups'],
    color: '#7B1FA2',
    badge: 'Dev'
  },
  {
    id: 26,
    title: 'Color Picker',
    description: 'Pick colors, convert formats, generate palettes and harmonies.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="cpGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff6b35" /><stop offset="100%" stopColor="#34a853" /></linearGradient></defs>
        <path fill="url(#cpGrad)" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1-.01-.83.67-1.5 1.49-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
      </svg>
    ),
    path: '/color-picker',
    features: ['HEX/RGB/HSL', '24 presets', 'Color harmonies', 'Alpha channel'],
    color: '#ff6b35',
    badge: 'Design'
  },
  {
    id: 27,
    title: 'Text Diff',
    description: 'Compare two texts side by side — find additions and deletions.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="diffGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#34a853" /><stop offset="100%" stopColor="#ea4335" /></linearGradient></defs>
        <path fill="url(#diffGrad)" d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z"/>
      </svg>
    ),
    path: '/text-diff',
    features: ['Side-by-side view', 'Line numbers', 'Ignore case/whitespace', 'Unified diff copy'],
    color: '#34a853',
    badge: 'Dev'
  },
  {
    id: 28,
    title: 'Markdown Preview',
    description: 'Write Markdown with live preview — headings, code, tables, and more.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="mdGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#4285f4" /><stop offset="100%" stopColor="#7B1FA2" /></linearGradient></defs>
        <path fill="url(#mdGrad)" d="M20.56 18H3.44C2.65 18 2 17.37 2 16.59V7.41C2 6.63 2.65 6 3.44 6h17.12c.79 0 1.44.63 1.44 1.41v9.18c0 .78-.65 1.41-1.44 1.41M6.81 15.19V11.53l1.92 2.35 1.92-2.35v3.66h1.93V8.81h-1.93l-1.92 2.35-1.92-2.35H4.89v6.38h1.92M19.69 12h-1.92V8.81h-1.92V12h-1.93l2.89 3.28L19.69 12z"/>
      </svg>
    ),
    path: '/markdown-preview',
    features: ['Split/edit/preview', 'Live rendering', 'Word/char count', 'Syntax support'],
    color: '#4285f4',
    badge: 'Dev'
  },
  {
    id: 29,
    title: 'Cron Generator',
    description: 'Generate and validate cron expressions with human-readable output.',
    icon: (
      <svg viewBox="0 0 24 24" width="28" height="28">
        <defs><linearGradient id="cronGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#fbbc04" /><stop offset="100%" stopColor="#ea4335" /></linearGradient></defs>
        <path fill="url(#cronGrad)" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
      </svg>
    ),
    path: '/cron-generator',
    features: ['12 quick presets', 'Human-readable', 'Next 5 run times', 'Copy cron string'],
    color: '#fbbc04',
    badge: 'Dev'
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
            31 Professional Tools - 100% Free
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}>
            The Complete SEO<br />Toolkit You Need
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.6 }}>
            Analyze, audit, track, and optimize your website with 31 powerful tools. 
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
            <div className="stat-item"><span className="stat-number">31</span><span className="stat-label">Tools</span></div>
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
          <h2>31 Powerful Tools</h2>
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

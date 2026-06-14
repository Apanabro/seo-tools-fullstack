import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import RankTracker from './pages/RankTracker';
import SeoAudit from './pages/SeoAudit';
import LinkChecker from './pages/LinkChecker';
import MetaGenerator from './pages/MetaGenerator';
import RobotsGenerator from './pages/RobotsGenerator';
import SitemapGenerator from './pages/SitemapGenerator';
import KeywordResearch from './pages/KeywordResearch';
import PageSpeed from './pages/PageSpeed';
import BacklinkChecker from './pages/BacklinkChecker';
import ContentAnalyzer from './pages/ContentAnalyzer';
import SchemaGenerator from './pages/SchemaGenerator';
import RedirectChecker from './pages/RedirectChecker';
import IPLookup from './pages/IPLookup';
import HeaderChecker from './pages/HeaderChecker';
import MobileTest from './pages/MobileTest';
import KeywordDensity from './pages/KeywordDensity';
import PasswordGenerator from './pages/PasswordGenerator';
import QRGenerator from './pages/QRGenerator';
import JSONFormatter from './pages/JSONFormatter';
import EncodeTools from './pages/EncodeTools';
import HashGenerator from './pages/HashGenerator';
import LoremGenerator from './pages/LoremGenerator';
import SitemapViewer from './pages/SitemapViewer';
import RobotsTxtViewer from './pages/RobotsTxtViewer';
import RegexTester from './pages/RegexTester';
import ColorPicker from './pages/ColorPicker';
import TextDiff from './pages/TextDiff';
import MarkdownPreview from './pages/MarkdownPreview';
import CronGenerator from './pages/CronGenerator';
import Login from './pages/Login';
import Signup from './pages/Signup';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/keyword-research" element={<KeywordResearch />} />
        <Route path="/rank-tracker" element={<RankTracker />} />
        <Route path="/seo-audit" element={<SeoAudit />} />
        <Route path="/page-speed" element={<PageSpeed />} />
        <Route path="/backlink-checker" element={<BacklinkChecker />} />
        <Route path="/content-analyzer" element={<ContentAnalyzer />} />
        <Route path="/link-checker" element={<LinkChecker />} />
        <Route path="/meta-generator" element={<MetaGenerator />} />
        <Route path="/robots-generator" element={<RobotsGenerator />} />
        <Route path="/sitemap-generator" element={<SitemapGenerator />} />
        <Route path="/schema-generator" element={<SchemaGenerator />} />
        <Route path="/redirect-checker" element={<RedirectChecker />} />
        <Route path="/ip-lookup" element={<IPLookup />} />
        <Route path="/header-checker" element={<HeaderChecker />} />
        <Route path="/mobile-test" element={<MobileTest />} />
        <Route path="/keyword-density" element={<KeywordDensity />} />
        <Route path="/password-generator" element={<PasswordGenerator />} />
        <Route path="/qr-generator" element={<QRGenerator />} />
        <Route path="/json-formatter" element={<JSONFormatter />} />
        <Route path="/encoder-decoder" element={<EncodeTools />} />
        <Route path="/hash-generator" element={<HashGenerator />} />
        <Route path="/lorem-generator" element={<LoremGenerator />} />
        <Route path="/sitemap-viewer" element={<SitemapViewer />} />
        <Route path="/robots-txt-viewer" element={<RobotsTxtViewer />} />
        <Route path="/regex-tester" element={<RegexTester />} />
        <Route path="/color-picker" element={<ColorPicker />} />
        <Route path="/text-diff" element={<TextDiff />} />
        <Route path="/markdown-preview" element={<MarkdownPreview />} />
        <Route path="/cron-generator" element={<CronGenerator />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <AnimatedRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;

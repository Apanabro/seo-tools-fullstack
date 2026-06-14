import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

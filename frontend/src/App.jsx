import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
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
import UUIDGenerator from './pages/UUIDGenerator';
import TimestampConverter from './pages/TimestampConverter';
import GradientGenerator from './pages/GradientGenerator';
import BoxShadowGenerator from './pages/BoxShadowGenerator';
import FlexboxPlayground from './pages/FlexboxPlayground';
import CSSGridGenerator from './pages/CSSGridGenerator';
import ContrastChecker from './pages/ContrastChecker';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import OtpVerify from './pages/OtpVerify';

function AppLayout() {
  return (
    <div className="app">
      <Navbar />
      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

const router = createHashRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'keyword-research', element: <KeywordResearch /> },
      { path: 'rank-tracker', element: <RankTracker /> },
      { path: 'seo-audit', element: <SeoAudit /> },
      { path: 'page-speed', element: <PageSpeed /> },
      { path: 'backlink-checker', element: <BacklinkChecker /> },
      { path: 'content-analyzer', element: <ContentAnalyzer /> },
      { path: 'link-checker', element: <LinkChecker /> },
      { path: 'meta-generator', element: <MetaGenerator /> },
      { path: 'robots-generator', element: <RobotsGenerator /> },
      { path: 'sitemap-generator', element: <SitemapGenerator /> },
      { path: 'schema-generator', element: <SchemaGenerator /> },
      { path: 'redirect-checker', element: <RedirectChecker /> },
      { path: 'ip-lookup', element: <IPLookup /> },
      { path: 'header-checker', element: <HeaderChecker /> },
      { path: 'mobile-test', element: <MobileTest /> },
      { path: 'keyword-density', element: <KeywordDensity /> },
      { path: 'password-generator', element: <PasswordGenerator /> },
      { path: 'qr-generator', element: <QRGenerator /> },
      { path: 'json-formatter', element: <JSONFormatter /> },
      { path: 'encoder-decoder', element: <EncodeTools /> },
      { path: 'hash-generator', element: <HashGenerator /> },
      { path: 'lorem-generator', element: <LoremGenerator /> },
      { path: 'sitemap-viewer', element: <SitemapViewer /> },
      { path: 'robots-txt-viewer', element: <RobotsTxtViewer /> },
      { path: 'regex-tester', element: <RegexTester /> },
      { path: 'color-picker', element: <ColorPicker /> },
      { path: 'text-diff', element: <TextDiff /> },
      { path: 'markdown-preview', element: <MarkdownPreview /> },
      { path: 'cron-generator', element: <CronGenerator /> },
      { path: 'uuid-generator', element: <UUIDGenerator /> },
      { path: 'timestamp-converter', element: <TimestampConverter /> },
      { path: 'gradient-generator', element: <GradientGenerator /> },
      { path: 'box-shadow-generator', element: <BoxShadowGenerator /> },
      { path: 'flexbox-playground', element: <FlexboxPlayground /> },
      { path: 'css-grid-generator', element: <CSSGridGenerator /> },
      { path: 'contrast-checker', element: <ContrastChecker /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'privacy', element: <Privacy /> },
      { path: 'terms', element: <Terms /> },
      { path: 'contact', element: <Contact /> },
      { path: 'verify-otp', element: <OtpVerify /> },
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

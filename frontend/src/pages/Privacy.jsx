import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Privacy = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16">
    <div className="max-w-4xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Privacy Policy</h1>
          <p className="text-gray-500 dark:text-gray-400">Last updated: January 2025</p>
        </div>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">When you create an account, we collect your name and email address. We also collect tool usage analytics (which tools you use, browser, OS, and approximate IP) to improve our services.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">2. How We Use Your Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your data is used solely to provide and improve the service. We do not sell, share, or rent your personal information to third parties.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">3. Third-Party Services</h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 mb-4 space-y-2">
            <li>Google OAuth (login) — see <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Google's Privacy Policy</a></li>
            <li>EmailJS (OTP emails) — see <a href="https://www.emailjs.com/legal/privacy-policy/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">EmailJS Privacy</a></li>
            <li>MongoDB Atlas (data storage) — see <a href="https://www.mongodb.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">MongoDB's Privacy</a></li>
            <li>GitHub Pages (hosting) — see <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">GitHub's Privacy</a></li>
            <li>Railway (backend API) — see <a href="https://railway.app/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Railway's Privacy</a></li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">4. Analytics</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">We track which tools you use and basic usage patterns (timestamps, duration) to understand how our tools are being used. This data is stored securely and is only accessible to the site administrator.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">5. Data Retention</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Your account data is retained until you request deletion. Analytics data is capped at 500 entries per user.</p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4">5. Contact</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Questions? Email <a href="mailto:privacy@seo-tools.com" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@seo-tools.com</a></p>
        </div>

        <div className="mt-10 text-center">
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors no-underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
            Back to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

export default Privacy;

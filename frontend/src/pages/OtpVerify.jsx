import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import emailjs from '@emailjs/browser';

const API_URL = 'https://seo-tools-api-production.up.railway.app';

const EMAILJS_SERVICE_ID = 'service_za9cn5t';
const EMAILJS_TEMPLATE_ID = 'template_mqvu6o7';
const EMAILJS_PUBLIC_KEY = 'G6-rBJQmi1II39qLL';

const OtpVerify = () => {
  const { pendingUser, completeLogin, logout } = useAuth();
  const navigate = useNavigate();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!pendingUser) { navigate('/login'); return; }
    const email = pendingUser?.email;
    if (!email) { navigate('/login'); return; }
    const doSendOtp = async () => {
      setResending(true);
      setError('');
      try {
        const res = await fetch(`${API_URL}/api/otp/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data.success && data.otp) {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
              email: email,
              passcode: data.otp,
              time: new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString()
            }
          );
          setSuccess(`OTP sent to ${email}`);
          setCountdown(60);
        } else {
          setError(data.error || 'Failed to generate OTP');
        }
      } catch (e) {
        console.error('OTP send error:', e);
        if (e.text) setError('Email send failed: ' + e.text);
        else setError('Failed to send OTP: ' + (e.message || 'Unknown error'));
      }
      setResending(false);
    };
    doSendOtp();
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendOtp = async () => {
    setResending(true);
    setError('');
    const email = pendingUser?.email;
    if (!email) {
      setError('No email found. Please go back and try again.');
      setResending(false);
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/otp/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (data.success && data.otp) {
        const response = await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            email: email,
            passcode: data.otp,
            time: new Date(Date.now() + 5 * 60 * 1000).toLocaleTimeString()
          }
        );
        console.log('EmailJS response:', response);
        setSuccess(`OTP sent to ${email}`);
        setCountdown(60);
      } else {
        setError(data.error || 'Failed to generate OTP');
      }
    } catch (e) {
      console.error('OTP send error:', e);
      if (e.text) {
        setError('Email send failed: ' + e.text);
      } else {
        setError('Failed to send OTP: ' + (e.message || 'Unknown error'));
      }
    }
    setResending(false);
  };

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = pasted.split('').concat(Array(6).fill('')).slice(0, 6);
    setOtp(newOtp);
    const nextEmpty = newOtp.findIndex(v => !v);
    inputRefs.current[nextEmpty === -1 ? 5 : nextEmpty]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) { setError('Please enter the complete 6-digit code'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: pendingUser?.email, otp: code })
      });
      const data = await res.json();
      if (data.success) {
        completeLogin(pendingUser);
        navigate('/');
      } else {
        setError(data.error || 'Invalid OTP');
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (e) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verify Your Email</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              We sent a 6-digit code to<br />
              <span className="font-semibold text-gray-900 dark:text-gray-100">{pendingUser?.email}</span>
            </p>
          </div>

          {success && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm rounded-xl border border-blue-100 dark:border-blue-800">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-xl border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                />
              ))}
            </div>

            <button type="submit" disabled={loading || otp.join('').length !== 6} className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md">
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <button onClick={handleCancel} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Cancel & Go Back
            </button>
            <div>
              {countdown > 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">Resend code in {countdown}s</p>
              ) : (
                <button onClick={sendOtp} disabled={resending} className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline disabled:opacity-50">
                  {resending ? 'Sending...' : 'Resend Code'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default OtpVerify;

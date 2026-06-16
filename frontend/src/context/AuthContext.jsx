import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);
const API_URL = 'https://seo-tools-api-production.up.railway.app';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [pendingUser, setPendingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.includes('access_token')) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      if (accessToken) {
        fetchGoogleUser(accessToken);
        return;
      }
    }

    const saved = localStorage.getItem('seo_tools_user');
    if (saved) {
      try { setUser(JSON.parse(saved)); } catch(e) { localStorage.removeItem('seo_tools_user'); }
    }
    setLoading(false);
  }, []);

  const getBrowserInfo = () => {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('Edge')) browser = 'Edge';
    let os = 'Unknown';
    if (ua.includes('Windows')) os = 'Windows';
    else if (ua.includes('Mac')) os = 'MacOS';
    else if (ua.includes('Linux')) os = 'Linux';
    return { browser, os };
  };

  const fetchGoogleUser = async (accessToken) => {
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        const { browser, os } = getBrowserInfo();
        const checkRes = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email, browser, os })
        });
        const checkData = await checkRes.json();
        if (checkData.success && checkData.user) {
          setUser(checkData.user);
          localStorage.setItem('seo_tools_user', JSON.stringify(checkData.user));
          setLoading(false);
          window.location.hash = '#/';
        } else {
          const userData = { id: data.id, name: data.name, email: data.email, picture: data.picture };
          setPendingUser(userData);
          setLoading(false);
          window.location.hash = '#/verify-otp';
        }
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error('Failed to fetch Google user info:', e);
      setLoading(false);
    }
  };

  const completeLogin = async (userData) => {
    try {
      const { browser, os } = getBrowserInfo();
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, signupMethod: userData.picture ? 'google' : 'email', browser, os })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        setPendingUser(null);
        localStorage.setItem('seo_tools_user', JSON.stringify(data.user));
      }
    } catch (e) {
      console.error('Failed to register user:', e);
      setUser(userData);
      setPendingUser(null);
      localStorage.setItem('seo_tools_user', JSON.stringify(userData));
    }
  };

  const login = async (email, password) => {
    try {
      const { browser, os } = getBrowserInfo();
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, browser, os })
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        localStorage.setItem('seo_tools_user', JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (e) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const logout = () => {
    setUser(null);
    setPendingUser(null);
    localStorage.removeItem('seo_tools_user');
  };

  const setPending = (userData) => {
    setPendingUser(userData);
    setLoading(false);
  };

  const trackAnalytics = async (tool, action, duration) => {
    if (!user) return;
    try {
      await fetch(`${API_URL}/api/analytics/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, tool, action, duration })
      });
    } catch (e) { /* silent fail */ }
  };

  return (
    <AuthContext.Provider value={{ user, pendingUser, completeLogin, login, logout, setPendingUser: setPending, trackAnalytics, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

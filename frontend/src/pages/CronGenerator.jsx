import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './ToolPage.css';

const CronGenerator = () => {
  const { dark } = useTheme();
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const cronExpression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;

  const templates = [
    { name: 'Every minute', desc: '* * * * *', values: ['*', '*', '*', '*', '*'] },
    { name: 'Every hour', desc: '0 * * * *', values: ['0', '*', '*', '*', '*'] },
    { name: 'Every day at midnight', desc: '0 0 * * *', values: ['0', '0', '*', '*', '*'] },
    { name: 'Every day at 9 AM', desc: '0 9 * * *', values: ['0', '9', '*', '*', '*'] },
    { name: 'Every Monday', desc: '0 0 * * 1', values: ['0', '0', '*', '*', '1'] },
    { name: 'Every Friday at 5 PM', desc: '0 17 * * 5', values: ['0', '17', '*', '*', '5'] },
    { name: 'First of every month', desc: '0 0 1 * *', values: ['0', '0', '1', '*', '*'] },
    { name: 'Every 15 minutes', desc: '*/15 * * * *', values: ['*/15', '*', '*', '*', '*'] },
    { name: 'Every 6 hours', desc: '0 */6 * * *', values: ['0', '*/6', '*', '*', '*'] },
    { name: 'Weekdays at 9 AM', desc: '0 9 * * 1-5', values: ['0', '9', '*', '*', '1-5'] },
    { name: 'Weekends at noon', desc: '0 12 * * 0,6', values: ['0', '12', '*', '*', '0,6'] },
    { name: 'Every 30 minutes', desc: '*/30 * * * *', values: ['*/30', '*', '*', '*', '*'] },
  ];

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getNextRuns = (expr) => {
    const [m, h, dom, mo, dow] = expr.split(' ');
    const now = new Date();
    const runs = [];
    const checkDate = new Date(now);

    for (let i = 0; i < 5; i++) {
      checkDate.setMinutes(checkDate.getMinutes() + 1);
      const cm = m === '*' || m.includes('*') || (m.includes('/') && checkDate.getMinutes() % parseInt(m.split('/')[1]) === 0) || m.split(',').includes(String(checkDate.getMinutes())) || (m.includes('-') && (() => { const [a,b] = m.split('-').map(Number); return checkDate.getMinutes() >= a && checkDate.getMinutes() <= b; })());
      const ch = h === '*' || h.includes('*') || (h.includes('/') && checkDate.getHours() % parseInt(h.split('/')[1]) === 0) || h.split(',').includes(String(checkDate.getHours()));
      const cdom = dom === '*' || dom.includes('*') || dom.split(',').includes(String(checkDate.getDate()));
      const cmo = mo === '*' || mo.includes('*') || mo.split(',').includes(String(checkDate.getMonth() + 1));
      const cdow = dow === '*' || dow.includes('*') || dow.split(',').includes(String(checkDate.getDay())) || (dow.includes('-') && (() => { const [a,b] = dow.split('-').map(Number); return checkDate.getDay() >= a && checkDate.getDay() <= b; })());

      if (cm && ch && cdom && cmo && cdow && checkDate > now) {
        runs.push(new Date(checkDate));
        if (runs.length >= 5) break;
      }
    }
    return runs;
  };

  const nextRuns = useMemo(() => getNextRuns(cronExpression), [cronExpression]);

  const applyTemplate = (t, i) => {
    setSelectedTemplate(i);
    setMinute(t.values[0]); setHour(t.values[1]); setDayOfMonth(t.values[2]); setMonth(t.values[3]); setDayOfWeek(t.values[4]);
  };

  const humanReadable = useMemo(() => {
    const parts = [];
    if (minute === '*' && hour === '*') parts.push('Every minute');
    else if (minute === '0' && hour === '*') parts.push('Every hour at :00');
    else if (minute === '0' && hour !== '*') parts.push(`At ${hour}:00`);
    else if (minute.includes('*/')) parts.push(`Every ${minute.split('/')[1]} minutes`);
    else parts.push(`At minute ${minute}`);

    if (dayOfWeek !== '*') {
      if (dayOfWeek.includes('-')) {
        const [a, b] = dayOfWeek.split('-').map(Number);
        parts.push(`on weekdays (${dayNames[a]}-${dayNames[b]})`);
      } else {
        parts.push(`on ${dayOfWeek.split(',').map(d => dayNames[parseInt(d)]).join(', ')}`);
      }
    }

    if (dayOfMonth !== '*') parts.push(`on day ${dayOfMonth}`);
    if (month !== '*') parts.push(`in ${month.split(',').map(m => monthNames[parseInt(m) - 1]).join(', ')}`);

    return parts.join(' ');
  }, [cronExpression]);

  return (
    <div className="tool-page">
      <motion.div className="tool-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="tool-icon">⏰</div>
        <h1>Cron Expression Generator</h1>
        <p>Generate and validate cron expressions — see human-readable descriptions and next run times</p>
      </motion.div>

      <div className="tool-form">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px', marginBottom: '16px' }}>
          {[
            { label: 'Minute', value: minute, set: setMinute, range: 59, icon: '⏱️' },
            { label: 'Hour', value: hour, set: setHour, range: 23, icon: '🕐' },
            { label: 'Day of Month', value: dayOfMonth, set: setDayOfMonth, range: 31, icon: '📅' },
            { label: 'Month', value: month, set: setMonth, range: 12, icon: '📆' },
            { label: 'Day of Week', value: dayOfWeek, set: setDayOfWeek, range: 6, icon: '📋' },
          ].map((field, i) => (
            <div key={i} className="form-group">
              <label style={{ fontSize: '12px' }}>{field.icon} {field.label}</label>
              <input type="text" value={field.value} onChange={(e) => field.set(e.target.value)} style={{ fontFamily: 'var(--font-mono)', textAlign: 'center', fontSize: '16px', fontWeight: 700 }} />
            </div>
          ))}
        </div>

        <div style={{ background: 'var(--gray-50)', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-500)', marginBottom: '4px' }}>CRON EXPRESSION</div>
          <code style={{ fontSize: '24px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: 'var(--google-blue)', letterSpacing: '4px' }}>{cronExpression}</code>
        </div>

        <div style={{ background: 'var(--google-blue-light)', borderRadius: '12px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--google-blue)', marginBottom: '4px' }}>HUMAN READABLE</div>
          <div style={{ fontSize: '16px', fontWeight: 600 }}>{humanReadable}</div>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '8px', display: 'block' }}>Quick Presets</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
            {templates.map((t, i) => (
              <button key={i} className={`btn-secondary ${selectedTemplate === i ? 'active' : ''}`} onClick={() => applyTemplate(t, i)} style={{ textAlign: 'left', padding: '10px 14px', fontSize: '13px', background: selectedTemplate === i ? 'var(--google-blue-light)' : undefined }}>
                <div style={{ fontWeight: 600 }}>{t.name}</div>
                <code style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--gray-500)' }}>{t.desc}</code>
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {['*', '*/5', '*/10', '*/15', '*/30'].map(v => (
            <button key={v} className="btn-secondary" onClick={() => setMinute(v)} style={{ fontSize: '12px', padding: '6px 12px' }}>{v}</button>
          ))}
          <span style={{ color: 'var(--gray-400)', margin: '0 4px' }}>|</span>
          {['0', '15', '30', '45'].map(v => (
            <button key={v} className="btn-secondary" onClick={() => setMinute(v)} style={{ fontSize: '12px', padding: '6px 12px' }}>:{v}</button>
          ))}
        </div>
      </div>

      <div className="result-box">
        <div className="result-header">
          <h2>Next 5 Run Times</h2>
          <button className="btn-secondary" onClick={() => navigator.clipboard.writeText(cronExpression)}>📋 Copy Cron</button>
        </div>
        {nextRuns.length > 0 ? (
          <div className="check-list">
            {nextRuns.map((run, i) => (
              <div className="check-item" key={i}>
                <div className="check-status blue">#{i + 1}</div>
                <div className="check-info">
                  <div className="check-title" style={{ fontFamily: 'var(--font-mono)' }}>{run.toLocaleString()}</div>
                  <div className="check-desc">{run.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--gray-500)', padding: '20px' }}>No upcoming runs found in the next hour</p>
        )}
      </div>
    </div>
  );
};

export default CronGenerator;

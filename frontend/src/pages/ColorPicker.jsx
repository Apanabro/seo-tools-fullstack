import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import './ToolPage.css';

const ColorPicker = () => {
  const { dark } = useTheme();
  const [color, setColor] = useState('#4285f4');
  const [hue, setHue] = useState(210);
  const [saturation, setSaturation] = useState(76);
  const [lightness, setLightness] = useState(59);
  const [alpha, setAlpha] = useState(100);
  const canvasRef = useRef(null);

  const hslToHex = (h, s, l) => {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const hexToHSL = (hex) => {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const handleHexChange = (hex) => {
    if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      setColor(hex);
      const hsl = hexToHSL(hex);
      setHue(hsl.h); setSaturation(hsl.s); setLightness(hsl.l);
    }
  };

  const handleHSLChange = (h, s, l) => {
    setHue(h); setSaturation(s); setLightness(l);
    setColor(hslToHex(h, s, l));
  };

  const rgbToRGBA = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const a = alpha / 100;
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`;
  };

  const copyColor = (value) => navigator.clipboard.writeText(value);

  const colorFormats = [
    { name: 'HEX', value: color.toUpperCase() },
    { name: 'RGB', value: `rgb(${parseInt(color.slice(1,3),16)}, ${parseInt(color.slice(3,5),16)}, ${parseInt(color.slice(5,7),16)})` },
    { name: 'HSL', value: `hsl(${hue}, ${saturation}%, ${lightness}%)` },
    { name: 'RGBA', value: rgbToRGBA(color) },
    { name: 'HSLA', value: `hsla(${hue}, ${saturation}%, ${lightness}%, ${(alpha/100).toFixed(2)})` },
  ];

  const presetColors = [
    '#EA4335', '#FBBC04', '#34A853', '#4285F4', '#FF6D01', '#46BDC6',
    '#7B1FA2', '#C2185B', '#00796B', '#1565C0', '#EF6C00', '#455A64',
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', '#2196F3',
    '#00BCD4', '#009688', '#4CAF50', '#8BC34A', '#FFC107', '#FF9800',
  ];

  const colorHarmonies = [
    { name: 'Complementary', colors: [color, hslToHex((hue + 180) % 360, saturation, lightness)] },
    { name: 'Triadic', colors: [color, hslToHex((hue + 120) % 360, saturation, lightness), hslToHex((hue + 240) % 360, saturation, lightness)] },
    { name: 'Analogous', colors: [hslToHex((hue - 30 + 360) % 360, saturation, lightness), color, hslToHex((hue + 30) % 360, saturation, lightness)] },
    { name: 'Split-Complementary', colors: [color, hslToHex((hue + 150) % 360, saturation, lightness), hslToHex((hue + 210) % 360, saturation, lightness)] },
    { name: 'Shades', colors: Array.from({length: 6}, (_, i) => hslToHex(hue, saturation, Math.max(10, lightness - i * 10))) },
  ];

  return (
    <div className="tool-page">
      <motion.div className="tool-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="tool-icon">🎨</div>
        <h1>Color Picker</h1>
        <p>Pick colors, convert formats (HEX, RGB, HSL), generate palettes, and explore color harmonies</p>
      </motion.div>

      <div className="tool-form">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div>
            <div style={{ width: '100%', height: '240px', borderRadius: '16px', background: color, border: '3px solid white', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', marginBottom: '16px', position: 'relative', cursor: 'crosshair' }}
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const newHue = Math.round((x / rect.width) * 360);
                handleHSLChange(newHue, saturation, lightness);
              }}>
              <div style={{ position: 'absolute', bottom: '8px', right: '8px', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '14px', fontFamily: 'var(--font-mono)' }}>{color.toUpperCase()}</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '4px', display: 'block' }}>Hue: {hue}°</label>
                <input type="range" min="0" max="360" value={hue} onChange={e => handleHSLChange(parseInt(e.target.value), saturation, lightness)} style={{ width: '100%', accentColor: `hsl(${hue}, 100%, 50%)` }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '4px', display: 'block' }}>Saturation: {saturation}%</label>
                <input type="range" min="0" max="100" value={saturation} onChange={e => handleHSLChange(hue, parseInt(e.target.value), lightness)} style={{ width: '100%', accentColor: color }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '4px', display: 'block' }}>Lightness: {lightness}%</label>
                <input type="range" min="0" max="100" value={lightness} onChange={e => handleHSLChange(hue, saturation, parseInt(e.target.value))} style={{ width: '100%', accentColor: color }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '4px', display: 'block' }}>Alpha: {alpha}%</label>
                <input type="range" min="0" max="100" value={alpha} onChange={e => setAlpha(parseInt(e.target.value))} style={{ width: '100%', accentColor: color }} />
              </div>
            </div>
          </div>

          <div>
            <div style={{ display: 'grid', gap: '8px', marginBottom: '16px' }}>
              {colorFormats.map((cf, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--gray-50)', borderRadius: '10px', border: '1px solid var(--gray-200)' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>{cf.name}</span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', marginTop: '2px' }}>{cf.value}</div>
                  </div>
                  <button onClick={() => copyColor(cf.value)} className="btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }}>Copy</button>
                </div>
              ))}
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '8px', display: 'block' }}>Direct Input</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="color" value={color} onChange={(e) => handleHexChange(e.target.value)} style={{ width: '48px', height: '40px', border: 'none', borderRadius: '8px', cursor: 'pointer' }} />
                <input type="text" value={color} onChange={(e) => handleHexChange(e.target.value)} style={{ flex: 1, fontFamily: 'var(--font-mono)', fontSize: '14px' }} />
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-600)', marginBottom: '8px', display: 'block' }}>Presets</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '6px' }}>
                {presetColors.map((c, i) => (
                  <button key={i} onClick={() => handleHexChange(c)} style={{ width: '100%', aspectRatio: '1', borderRadius: '6px', background: c, border: color === c ? '3px solid var(--gray-900)' : '2px solid white', cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Color Harmonies</h3>
          {colorHarmonies.map((h, i) => (
            <div key={i} style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--gray-600)' }}>{h.name}</span>
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                {h.colors.map((c, j) => (
                  <button key={j} onClick={() => handleHexChange(c)} style={{ flex: 1, height: '48px', borderRadius: '8px', background: c, border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '4px' }}>
                    <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: lightness > 50 ? 'rgba(0,0,0,0.7)' : 'white' }}>{c.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;

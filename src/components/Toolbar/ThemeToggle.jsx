import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [light, setLight] = useState(() => document.documentElement.classList.contains('light-theme'));
  useEffect(() => {
    if (light) document.documentElement.classList.add('light-theme');
    else document.documentElement.classList.remove('light-theme');
    if (typeof window !== 'undefined') {
      try { window.localStorage.setItem('viz-theme', light ? 'light' : 'dark'); } catch { /* ignore */ }
    }
  }, [light]);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try { const saved = window.localStorage.getItem('viz-theme'); if (saved === 'light') setLight(true); } catch { /* ignore */ }
    }
  }, []);
  return (
    <button
      type="button"
      className="button-ghost small-action theme-toggle"
      aria-pressed={light}
      aria-label={light ? 'Switch to dark theme' : 'Switch to light theme'}
      onClick={() => setLight(v => !v)}
    >
      {light ? 'Dark' : 'Light'}
    </button>
  );
}

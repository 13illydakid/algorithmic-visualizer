import { useEffect, useRef } from 'react';
import './Toolbar.css';

// Animated metric chips with accessibility
export default function MetricChips({ stats, perf, eta, progress }) {
  const prevRef = useRef({});
  const data = {
    cmp: stats?.comparisons ?? 0,
    swp: stats?.swaps ?? 0,
    eps: perf?.eps ?? 0,
    eta: eta != null ? Number(eta.toFixed(1)) : null,
    prog: progress ?? 0,
  };
  const chips = [
    { key: 'cmp', label: 'Comparisons', value: data.cmp },
    { key: 'swp', label: 'Swaps', value: data.swp },
    { key: 'eps', label: 'EPS', value: data.eps },
    data.eta != null ? { key: 'eta', label: 'ETA', value: data.eta + 's' } : null,
    { key: 'prog', label: 'Progress', value: data.prog + '%' },
  ].filter(Boolean);

  useEffect(() => { prevRef.current = chips.reduce((acc,c)=>{ acc[c.key]=c.value; return acc; },{}); });

  return (
    <div className="metric-chips" role="group" aria-label="Sorting metrics live">
      {chips.map(c => {
        const prev = prevRef.current[c.key];
        const changed = prev !== undefined && prev !== c.value;
        return (
          <div
            key={c.key}
            className={`metric-chip ${changed ? 'is-changed' : ''}`}
            title={c.label}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            aria-label={`${c.label} ${c.value}`}
          >
            <span className="m-val" data-prev={prev}>{c.value}</span>
            <span className="m-label">{c.label}</span>
          </div>
        );
      })}
    </div>
  );
}

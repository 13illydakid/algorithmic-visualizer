import './Toolbar.css';

// Displays key metric chips: comparisons, swaps, EPS, ETA, progress
// Props: stats { comparisons, swaps }, perf { eps }, eta, progress
export default function MetricChips({ stats, perf, eta, progress }) {
  const chips = [
    { key: 'cmp', label: 'Comparisons', value: stats?.comparisons ?? 0 },
    { key: 'swp', label: 'Swaps', value: stats?.swaps ?? 0 },
    { key: 'eps', label: 'EPS', value: perf?.eps ?? 0 },
    eta != null ? { key: 'eta', label: 'ETA', value: eta.toFixed(1) + 's' } : null,
    { key: 'prog', label: 'Progress', value: (progress ?? 0) + '%' },
  ].filter(Boolean);
  return (
    <div className="metric-chips" role="status" aria-label="Sorting metrics">
      {chips.map(c => (
        <div key={c.key} className="metric-chip" title={c.label}>
          <span className="m-val">{c.value}</span>
          <span className="m-label">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

import './Toolbar.css';

// Compact array size controller with pill track and +/- buttons.
// Props: value(0-100), onChange(newVal:number), length(displayed array length), disabled
export default function ArraySizeControl({ value, onChange, length, disabled, step = 1 }) {
  // value is logical 0..100 control value (not direct array length)
  const dec = () => { if (disabled) return; const next = Math.max(0, value - step); onChange(next); };
  const inc = () => { if (disabled) return; const next = Math.min(100, value + step); onChange(next); };
  const pct = (value / 100) * 100;
  return (
    <div className={`asc-root ${disabled ? 'is-disabled' : ''}`} aria-label="Array size control" role="group">
      <button className="asc-btn" onClick={dec} disabled={disabled || value <= 0} aria-label="Decrease array size">–</button>
      <div className="asc-track" onClick={(e) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        const raw = Math.round(ratio * 100);
        // Snap to step
        const snapped = Math.min(100, Math.max(0, Math.round(raw / step) * step));
        onChange(snapped);
      }}>
        <div className="asc-fill" style={{ width: pct + '%' }} />
        <div className="asc-thumb" style={{ left: pct + '%' }} />
      </div>
      <button className="asc-btn" onClick={inc} disabled={disabled || value >= 100} aria-label="Increase array size">+</button>
      <div className="asc-meta" aria-label="Current array length">
        <span className="asc-len">{length}</span>
        <span className="asc-label">items</span>
      </div>
    </div>
  );
}

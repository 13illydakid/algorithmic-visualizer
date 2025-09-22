import './Toolbar.css';

// Compact array size controller with pill track and +/- buttons.
// Props: value(0-100), onChange(newVal:number), length(displayed array length), disabled
export default function ArraySizeControl({ value, onChange, length, disabled }) {
  const dec = () => !disabled && onChange(Math.max(0, value - 1));
  const inc = () => !disabled && onChange(Math.min(100, value + 1));
  const pct = (value / 100) * 100;
  return (
    <div className={`asc-root ${disabled ? 'is-disabled' : ''}`} aria-label="Array size control" role="group">
      <button className="asc-btn" onClick={dec} disabled={disabled || value <= 0} aria-label="Decrease array size">–</button>
      <div className="asc-track" onClick={(e) => {
        if (disabled) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const ratio = (e.clientX - rect.left) / rect.width;
        onChange(Math.min(100, Math.max(0, Math.round(ratio * 100))));
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

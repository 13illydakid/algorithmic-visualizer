import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_SPEED, SPEED_LEVELS } from "../../utils/speedMapping";
import "./SpeedControl.css";

/* Contract
 * props: value (multiplier), onChange(multiplier)
 * Keyboard: active only while focused/clicked; Up increases, Down decreases by one step; Esc blurs.
 */
export default function SpeedControl({ value, onChange, disabled }) {
  const containerRef = useRef(null);
  const [focused, setFocused] = useState(false);

  // Ensure valid value
  const currentIndex = Math.max(0, SPEED_LEVELS.indexOf(value));

  const setByIndex = useCallback((idx) => {
    if (idx < 0 || idx >= SPEED_LEVELS.length) return;
    onChange && onChange(SPEED_LEVELS[idx]);
  }, [onChange]);

  const handleKey = useCallback((e) => {
    if (!focused) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setByIndex(currentIndex + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setByIndex(currentIndex - 1); }
    else if (e.key === 'Home') { e.preventDefault(); setByIndex(0); }
    else if (e.key === 'End') { e.preventDefault(); setByIndex(SPEED_LEVELS.length - 1); }
    else if (e.key === 'Escape') { setFocused(false); containerRef.current && containerRef.current.blur(); }
  }, [focused, currentIndex, setByIndex]);

  useEffect(() => { window.addEventListener('keydown', handleKey); return () => window.removeEventListener('keydown', handleKey); }, [handleKey]);
  useEffect(() => { const outside = (e) => { if (focused && containerRef.current && !containerRef.current.contains(e.target)) setFocused(false); }; window.addEventListener('mousedown', outside); return () => window.removeEventListener('mousedown', outside); }, [focused]);

  // Semi-circle geometry (0deg at left baseline, 180deg at right baseline)
  const angleRadForIndex = (idx) => (idx / (SPEED_LEVELS.length - 1)) * Math.PI; // 0..π
  const needleAngleDeg = (currentIndex / (SPEED_LEVELS.length - 1)) * 180; // for rotation convenience

  const radius = 60; // visual radius
  const cx = radius; // center x
  const cy = radius; // center y (baseline at cy)
  const needleLen = radius - 8;
  const needleAngleRad = angleRadForIndex(currentIndex);
  const needleX = cx - needleLen * Math.cos(needleAngleRad);
  const needleY = cy - needleLen * Math.sin(needleAngleRad);

  return (
    <div
      className={`speed-control semi ${focused ? 'is-focused' : ''} ${disabled ? 'is-disabled' : ''}`}
      ref={containerRef}
      tabIndex={0}
      role="group"
      aria-label="Speed control semi-circle"
      aria-disabled={disabled}
      onFocus={() => setFocused(true)}
      onClick={() => setFocused(true)}
    >
      <svg className="sc-semi" viewBox={`0 0 ${radius*2} ${radius}`} width={radius*2} height={radius} aria-hidden="true">
        <path className="sc-arc" d={describeArc(cx, cy, radius-4, 180, 0)} />
        {/* Ticks */}
        {SPEED_LEVELS.map((lvl, idx) => {
          const a = angleRadForIndex(idx);
          const x = cx - (radius-6) * Math.cos(a);
          const y = cy - (radius-6) * Math.sin(a);
          const active = lvl === value;
          return (
            <g key={lvl} className={`sc-tick ${active ? 'active' : ''}`} transform={`translate(${x} ${y})`}>
              <circle r={7} className="sc-tick-dot" onClick={(e)=>{ e.stopPropagation(); setByIndex(idx); setFocused(true); }} />
              <text className="sc-tick-label" y={-12}>{lvl}x</text>
            </g>
          );
        })}
        <line className="sc-needle" x1={cx} y1={cy} x2={needleX} y2={needleY} data-angle={needleAngleDeg} />
      </svg>
    </div>
  );
}

// SVG arc helper (large-arc-flag based on angles)
function polarToCartesian(cx, cy, r, angleDeg){ const rad=(angleDeg*Math.PI)/180; return { x: cx + r * Math.cos(rad), y: cy - r * Math.sin(rad) }; }
function describeArc(cx, cy, r, startAngle, endAngle){ const start=polarToCartesian(cx,cy,r,endAngle); const end=polarToCartesian(cx,cy,r,startAngle); const large = endAngle - startAngle <= 180 ? 0 : 1; return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`; }

SpeedControl.defaultProps = {
  value: DEFAULT_SPEED,
};

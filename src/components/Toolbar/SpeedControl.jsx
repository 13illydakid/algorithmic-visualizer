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

  const setByIndex = useCallback(
    (idx) => {
      if (idx < 0 || idx >= SPEED_LEVELS.length) return;
      onChange && onChange(SPEED_LEVELS[idx]);
    },
    [onChange]
  );

  const handleKey = useCallback(
    (e) => {
      if (!focused) return;
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setByIndex(currentIndex + 1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setByIndex(currentIndex - 1);
      } else if (e.key === "Escape") {
        setFocused(false);
        containerRef.current && containerRef.current.blur();
      }
    },
    [focused, currentIndex, setByIndex]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        focused &&
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setFocused(false);
      }
    }
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [focused]);

  const gaugeAngleForIndex = (idx) => {
    // Original range -90 to 90. Apply global rotation offset of -100 degrees (counterclockwise).
    const baseMin = -90;
    const baseMax = 90;
    const fraction = idx / (SPEED_LEVELS.length - 1);
    const raw = baseMin + fraction * (baseMax - baseMin);
    return raw - 100; // rotate counterclockwise
  };

  const angle = gaugeAngleForIndex(currentIndex);

  return (
    <div
      className={`speed-control ${focused ? 'is-focused' : ''} ${disabled ? 'is-disabled' : ''}`}
      ref={containerRef}
      tabIndex={0}
      aria-label="Speed control"
      onFocus={() => setFocused(true)}
      onClick={() => setFocused(true)}
      role="group"
      aria-disabled={disabled}
    >
      <div className="sc-radial" aria-hidden="true">
        <div className="sc-radial-arc" />
        <div className="sc-radial-hand" style={{ transform: `rotate(${angle}deg)` }} />
        {/* marks positioned absolutely along arc */}
        {SPEED_LEVELS.map((lvl, idx) => {
          const theta = gaugeAngleForIndex(idx) * (Math.PI/180);
          const radius = 70;
          const x = 70 + radius * Math.cos(theta);
          const y = 70 + radius * Math.sin(theta);
          const active = lvl === value;
          return (
            <button
              key={lvl}
              type="button"
              className={`sc-mark-h ${active ? 'active' : ''}`}
              style={{ left: x, top: y }}
              onClick={(e) => { e.stopPropagation(); setByIndex(idx); setFocused(true); }}
              aria-label={`Set speed to ${lvl}x`}
            >
              <span className="sc-dot-h" />
              <span className="sc-label-h">{lvl}x</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

SpeedControl.defaultProps = {
  value: DEFAULT_SPEED,
};

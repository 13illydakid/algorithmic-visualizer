import React, { useEffect, useRef, useState, useCallback } from "react";
import { SPEED_LEVELS, DEFAULT_SPEED } from "../../utils/speedMapping";
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
    // Map index 0 -> -90deg, last -> 90deg (semi-circle range 180deg)
    const min = -90;
    const max = 90;
    const fraction = idx / (SPEED_LEVELS.length - 1);
    return min + fraction * (max - min);
  };

  const angle = gaugeAngleForIndex(currentIndex);

  return (
    <div
      className={`speed-control ${focused ? "is-focused" : ""} ${
        disabled ? "is-disabled" : ""
      }`}
      ref={containerRef}
      tabIndex={0}
      aria-label="Speed control"
      onFocus={() => setFocused(true)}
      onClick={() => setFocused(true)}
      role="slider"
      aria-valuemin={SPEED_LEVELS[0]}
      aria-valuemax={SPEED_LEVELS[SPEED_LEVELS.length - 1]}
      aria-valuenow={value}
      aria-valuetext={`${value}x`}
      aria-disabled={disabled}
    >
      <div className="sc-vertical">
        {SPEED_LEVELS.slice()
          .reverse()
          .map((lvl) => {
            const idx = SPEED_LEVELS.indexOf(lvl);
            return (
              <button
                type="button"
                key={lvl}
                className={`sc-mark ${lvl === value ? "active" : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setByIndex(idx);
                  setFocused(true);
                }}
                disabled={disabled}
                aria-label={`Set speed to ${lvl}x`}
              >
                <span className="sc-label">{lvl}x</span>
                <span className="sc-dot" />
              </button>
            );
          })}
      </div>
      <div className="sc-gauge" aria-hidden="true">
        <div className="sc-gauge-arc" />
        <div
          className="sc-gauge-hand"
          style={{ transform: `rotate(${angle}deg)` }}
        />
      </div>
    </div>
  );
}

SpeedControl.defaultProps = {
  value: DEFAULT_SPEED,
};

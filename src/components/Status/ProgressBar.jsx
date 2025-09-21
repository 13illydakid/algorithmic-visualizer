import { useEffect, useState } from "react";
import { connect } from "react-redux";
import "./ProgressBar.css";

const DEBUG_DISABLE_PROGRESS = false; // toggle to false to re-enable

function ProgressBar({ array, currentSorted, isRunning, progress }) {
  // Hooks must run unconditionally
  const [pct, setPct] = useState(progress);

  useEffect(() => {
    if (!isRunning) {
      setPct(0);
      return;
    }
    setPct(
      progress ||
        Math.min(100, Math.round((currentSorted.length / array.length) * 100))
    );
  }, [progress, isRunning, currentSorted.length, array.length]);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      const newPct = progress || Math.min(100, Math.round((currentSorted.length / array.length) * 100));
      // Only update if progress changed by at least 1%
      setPct(prev => Math.abs(prev - newPct) >= 1 ? newPct : prev);
    }, 300); // Reduced frequency to 300ms for better performance
    return () => clearInterval(id);
  }, [isRunning, progress, currentSorted.length, array.length]);

  if (DEBUG_DISABLE_PROGRESS) return null;
  if (!isRunning || !array.length) return null;

  return (
    <div
      className="progress-shell"
      aria-label="Sorting progress"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span className="progress-label">{pct}%</span>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: pct + "%" }} />
        <div className="progress-glow" style={{ width: pct + "%" }} />
      </div>
    </div>
  );
}

const mapState = (s) => ({
  array: s.array,
  currentSorted: s.currentSorted || [],
  isRunning: s.isRunning,
  progress: s.progress,
});

export default connect(mapState)(ProgressBar);

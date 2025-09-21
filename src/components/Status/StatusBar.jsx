import { connect } from "react-redux";
import { computeDelay } from "../../utils/speedMapping";
import "./StatusBar.css";

function StatusBar(props) {
  const {
    algorithm,
    speed,
    stats,
    pivot,
    shellGap,
    currentBucket,
    currentCountIndex,
    paused,
    eta,
    perf,
  } = props;
  const delay = computeDelay(speed);
  return (
    <div className="status-bar" role="status" aria-live="polite">
      <div className="status-section">
        <span className="label">Algorithm:</span>
        <span className="value" data-testid="status-algorithm">
          {algorithm || "—"}
        </span>
      </div>
      <div className="status-section">
        <span className="label">Delay(ms):</span>
        <span className="value">{delay}</span>
      </div>
      <div className="status-section">
        <span className="label">Comparisons:</span>
        <span className="value">{stats.comparisons}</span>
      </div>
      <div className="status-section">
        <span className="label">Swaps:</span>
        <span className="value">{stats.swaps}</span>
      </div>
      {eta != null && (
        <div className="status-section">
          <span className="label">ETA(s):</span>
          <span className="value">{eta.toFixed(1)}</span>
        </div>
      )}
      {perf && perf.eps > 0 && (
        <div className="status-section">
          <span className="label">EPS:</span>
          <span className="value">{perf.eps}</span>
        </div>
      )}
      {pivot !== undefined && pivot !== null && (
        <div className="status-section">
          <span className="label">Pivot:</span>
          <span className="value">{pivot}</span>
        </div>
      )}
      {shellGap !== null && shellGap !== undefined && (
        <div className="status-section">
          <span className="label">Gap:</span>
          <span className="value">{shellGap}</span>
        </div>
      )}
      {currentBucket !== null && currentBucket !== undefined && (
        <div className="status-section">
          <span className="label">Bucket:</span>
          <span className="value">{currentBucket}</span>
        </div>
      )}
      {currentCountIndex !== null && currentCountIndex !== undefined && (
        <div className="status-section">
          <span className="label">Count Digit:</span>
          <span className="value">{currentCountIndex}</span>
        </div>
      )}
      <div className="status-section">
        <span className="label">State:</span>
        <span className="value">{paused ? "Paused" : "Running"}</span>
      </div>
    </div>
  );
}

const mapState = (state) => ({
  algorithm: state.algorithm,
  speed: state.speed,
  stats: state.stats,
  pivot: state.pivot,
  shellGap: state.shellGap,
  currentBucket: state.currentBucket,
  currentCountIndex: state.currentCountIndex,
  paused: state.paused,
  eta: state.eta,
  perf: state.perf,
});

export default connect(mapState)(StatusBar);

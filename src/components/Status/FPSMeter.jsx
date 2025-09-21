import { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';

const STYLE = {
  position: 'fixed',
  bottom: 8,
  right: 8,
  background: 'rgba(0,0,0,0.55)',
  color: '#fff',
  font: '11px/1.3 "Inter", system-ui',
  padding: '6px 8px',
  borderRadius: 6,
  zIndex: 9999,
  letterSpacing: '0.5px'
};

function FPSMeter({ perf, isRunning }) {
  const [fps, setFps] = useState(0);
  const last = useRef(performance.now());
  const frames = useRef(0);

  useEffect(() => {
    let id;
    function loop(ts) {
      frames.current++;
      if (ts - last.current >= 500) {
        const curFps = (frames.current * 1000) / (ts - last.current);
        setFps(Math.round(curFps));
        frames.current = 0;
        last.current = ts;
      }
      id = requestAnimationFrame(loop);
    }
    if (isRunning) {
      id = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(id);
  }, [isRunning]);

  if (!isRunning) return null;

  return (
    <div style={STYLE} aria-label="Performance metrics">
      <div>FPS: {fps}</div>
      <div>EPS: {perf.eps}</div>
      <div>Batch: {perf.batch}</div>
    </div>
  );
}

export default connect(s => ({ perf: s.perf, isRunning: s.isRunning }))(FPSMeter);

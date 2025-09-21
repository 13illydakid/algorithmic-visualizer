import { connect } from 'react-redux';
import { setTurbo } from '../../reducers/turbo';

function TurboControl({ turbo, setTurbo, disabled }) {
  const { enabled, keepCompare, finalizeBatch } = turbo;
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:4, fontSize:12, fontFamily:'Inter, system-ui' }}>
      <label style={{ fontWeight:600 }}>Turbo</label>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <input
          id="turbo-enabled"
          type="checkbox"
          checked={enabled}
          disabled={disabled}
          onChange={e => setTurbo({ enabled: e.target.checked })}
        />
        <label htmlFor="turbo-enabled">Enable</label>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        <label>Keep Compare (1 in N)</label>
        <select
          value={keepCompare}
          disabled={!enabled || disabled}
          onChange={e => setTurbo({ keepCompare: parseInt(e.target.value,10) })}
        >
          {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
        <label>Finalize Batch</label>
        <select
          value={finalizeBatch}
          disabled={!enabled || disabled}
          onChange={e => setTurbo({ finalizeBatch: parseInt(e.target.value,10) })}
        >
          {[1,2,5,10,20,50].map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>
    </div>
  );
}

export default connect(
  s => ({ turbo: s.turbo, disabled: s.isRunning && !s.paused }),
  d => ({ setTurbo: (p) => d(setTurbo(p)) })
)(TurboControl);

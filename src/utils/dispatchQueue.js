// A lightweight queue controller for pausable algorithm animations.
// We wrap the existing algorithm event arrays. Algorithms still push events
// but instead of recursive setTimeout inside each algorithm, we drain through here.

export default class DispatchQueue {
  constructor({ dispatch, getState, delayProvider, onComplete, perfCallback }) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.delayProvider = delayProvider; // () => ms
    this.onComplete = onComplete;
    this.perfCallback = perfCallback;
    this.events = [];
    this.index = 0;
    this.active = false;
    this._epsWindowStart = Date.now();
    this._epsCount = 0;
    this._lastBatch = 0;
  }

  load(events) {
    this.events = events;
    this.index = 0;
  }

  start() {
    if (this.active) return;
    this.active = true;
    this.step();
  }

  pause() {
    this.active = false;
  }

  resume() {
    if (!this.active) {
      this.active = true;
      this.step();
    }
  }

  step() {
    if (!this.active) return;
    if (this.index >= this.events.length) {
      this.active = false;
      this.onComplete && this.onComplete();
      return;
    }
    const { paused } = this.getState();
    if (paused) {
      this.active = false; // will be resumed externally
      return;
    }
    const delay = this.delayProvider();
    // Dynamic time budget: aim to spend <= 12ms executing a batch to stay under frame budget.
    const start = performance.now ? performance.now() : Date.now();
    let executed = 0;
    const HARD_CAP = 100; // safety
    do {
      const fn = this.events[this.index++];
      fn();
      executed++;
    } while (
      this.index < this.events.length &&
      executed < HARD_CAP &&
      (performance.now ? performance.now() : Date.now()) - start < 12 &&
      delay < 80 // only batch aggressively on faster speeds
    );

    // Instrumentation (EPS / batch)
    this._epsCount += executed;
    this._lastBatch = executed;
    const now2 = Date.now();
    if (now2 - this._epsWindowStart >= 500) {
      const eps = (this._epsCount * 1000) / (now2 - this._epsWindowStart);
      if (this.perfCallback) this.perfCallback({ eps: Math.round(eps), batch: this._lastBatch });
      this._epsWindowStart = now2;
      this._epsCount = 0;
    }
    // progress update (throttled every 500ms to reduce Redux overhead)
    const now = Date.now();
    if (!this._lastProgressTs || now - this._lastProgressTs >= 500) {
      this._lastProgressTs = now;
      try {
        const st = this.getState();
        const total = st.array.length || 1;
        const sorted = (st.currentSorted || []).length;
        const pct = Math.min(100, Math.round((sorted / total) * 100));
        // Only dispatch if progress actually changed and is significant
        if (st.progress !== pct && !isNaN(pct) && Math.abs((st.progress || 0) - pct) >= 2) {
          this.dispatch({ type: 'SET_PROGRESS', payload: pct });
        }
      } catch (e) { /* silent */ }
    }
    const nextDelay = this.delayProvider();
    if (nextDelay <= 12 && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => this.step());
    } else {
      setTimeout(() => this.step(), nextDelay);
    }
  }
}

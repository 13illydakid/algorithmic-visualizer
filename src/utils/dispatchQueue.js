// A lightweight queue controller for pausable algorithm animations.
// We wrap the existing algorithm event arrays. Algorithms still push events
// but instead of recursive setTimeout inside each algorithm, we drain through here.

export default class DispatchQueue {
  constructor({ dispatch, getState, delayProvider, onComplete }) {
    this.dispatch = dispatch;
    this.getState = getState;
    this.delayProvider = delayProvider; // () => ms
    this.onComplete = onComplete;
    this.events = [];
    this.index = 0;
    this.active = false;
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
    const fn = this.events[this.index++];
    fn();
    setTimeout(() => this.step(), this.delayProvider());
  }
}

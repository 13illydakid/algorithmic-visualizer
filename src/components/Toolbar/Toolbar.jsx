import { Component } from "react";
import ArraySizeControl from "./ArraySizeControl.jsx";
import MetricChips from "./MetricChips.jsx";
import SpeedControl from "./SpeedControl.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import "./Toolbar.css";
import TurboControl from "./TurboControl.jsx";
import logo from "../../assets/favicon.png";

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      rangeValue: 50,
      initialRangeValue: 50,
      originalArray: [],
      sorted: false,
    };
  }

  componentDidMount() {
    // Initialize array size from current rangeValue
    this.applyArraySize(this.state.rangeValue);
  }

  handleClick(algorithm) {
    const { updateAlgorithm } = this.props;
    updateAlgorithm(algorithm);
  }

  handleChange(evt) {
    const newValue = parseInt(evt.target.value, 10);
    this.applyArraySize(newValue);
  }

  applyArraySize(controlValue) {
    const { generateArray } = this.props;
    // Map control 0..100 to a length curve. Use quadratic easing for more resolution in smaller sizes.
    const t = Math.min(100, Math.max(0, controlValue)) / 100; // 0..1
    const maxLen = 240; // upper bound
    const eased = t * t; // quadratic ease
    const length = Math.max(5, Math.round(5 + eased * (maxLen - 5)));
    this.setState({ rangeValue: controlValue });
    generateArray(length);
  }

  rewindArray = () => {
    const { originalArray } = this.state;
    this.props.setArray(originalArray);
    this.setState({ sorted: false });
  };

  togglePause = () => {
    const { paused, dispatchSetPaused } = this.props;
    dispatchSetPaused(!paused);
  };

  render() {
  const { array, generateArray, isRunning, paused, speed, setSpeed, stats, perf, eta, progress } = this.props;
    const { rangeValue } = this.state;

  // Conditional styling could be added later; removed old color/cursor usage.

    return (
      <header id="toolbar" role="banner" aria-label="Sorting controls toolbar">
        <div id="toolbar-content" role="group" aria-label="Sorting toolbar groups">
          <div className="toolbar-left new-left-cluster">
            <button
              className="refresh-btn"
              disabled={isRunning}
              onClick={!isRunning ? () => generateArray(array.length) : undefined}
              aria-label="Generate new array"
            >
              <span className="refresh-glow" />
              {/* <svg viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12a9 9 0 0 1 15.36-6.36" />
                <polyline points="21 3 18 6 15 3" />
                <path d="M21 12a9 9 0 0 1-15.36 6.36" />
                <polyline points="3 21 6 18 9 21" />
              </svg> */}
              <div className="logo">
                <img src={logo} alt="Logo" />
              </div>
              
              <span className="refresh-label">New Array</span>
            </button>
            <ArraySizeControl
              value={rangeValue}
              onChange={(val) => this.applyArraySize(val)}
              length={array.length}
              disabled={isRunning}
              step={2}
            />
          </div>
          <div className="toolbar-center new-center-cluster">
            <MetricChips stats={stats} perf={perf} eta={eta} progress={progress} />
            {isRunning && (
              <button
                className="button-ghost small-action"
                onClick={this.togglePause}
                aria-pressed={paused}
                aria-label={paused ? "Resume animation" : "Pause animation"}
              >
                {paused ? "Resume" : "Pause"}
              </button>
            )}
            {this.state.sorted && !isRunning && (
              <button
                className="button-ghost small-action"
                onClick={this.rewindArray}
              >
                Rewind
              </button>
            )}
          </div>
          <div className="toolbar-right new-right-cluster">
            <SpeedControl value={speed} onChange={(val) => setSpeed(val)} disabled={false} />
            <TurboControl />
            <ThemeToggle />
          </div>
        </div>
      </header>
    );
  }
}

export default Toolbar;

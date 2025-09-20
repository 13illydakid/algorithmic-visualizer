import React, { Component } from "react";
import "./Toolbar.css";
import SpeedControl from "./SpeedControl.jsx";

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
    const { generateArray } = this.props;
    generateArray(87);

    const input = document.getElementById("changeSize");
    if (input) {
      input.style.background = `linear-gradient( to right, rgba(0, 0, 255, 0.75), rgba(255, 255, 0, 0.15) )`;
      input.value = 50;
    }
  }

  handleClick(algorithm) {
    const { updateAlgorithm } = this.props;
    updateAlgorithm(algorithm);
  }

  handleChange(evt) {
    const { generateArray } = this.props;
    const newValue = parseInt(evt.target.value, 10);
    const { initialRangeValue } = this.state;

    let blueOpacity = 0.75,
      yellowOpacity = 0.15;

    if (newValue > initialRangeValue) {
      const difference = newValue - initialRangeValue;
      yellowOpacity =
        0.15 + (difference / (100 - initialRangeValue)) * (1 - 0.15);
      if (yellowOpacity > 1) yellowOpacity = 1;
    } else {
      const difference = initialRangeValue - newValue;
      blueOpacity = 0.75 - (difference / initialRangeValue) * 0.75;
      if (blueOpacity < 0) blueOpacity = 0;
    }

    const input = document.getElementById("changeSize");
    if (input) {
      input.style.background = `linear-gradient( to right, rgba(0, 0, 255, ${blueOpacity}), rgba(255, 255, 0, ${yellowOpacity}) )`;
    }

    this.setState({ rangeValue: evt.target.value });
    generateArray(Math.floor((newValue + 3) * 1.65));
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
    const { array, generateArray, isRunning, paused, speed, setSpeed } =
      this.props;
    const { rangeValue } = this.state;

    const color = isRunning ? "rgba(214, 29, 29, 0.8)" : "white";
    const cursor = isRunning ? "auto" : "pointer";

    return (
      <header id="toolbar" role="banner" aria-label="Sorting controls toolbar">
        <div
          id="toolbar-content"
          role="group"
          aria-label="Sorting toolbar groups"
        >
          <div className="toolbar-left">
            <div
              id={!isRunning ? "generateArray" : "generateArrayX"}
              className="refresh-icon"
              style={{ color: color, cursor: cursor }}
              onClick={
                !isRunning ? () => generateArray(array.length) : undefined
              }
              title="Generate new array"
              role="button"
              aria-label="Generate new random array"
              tabIndex={0}
              onKeyDown={(e) => {
                if (!isRunning && (e.key === "Enter" || e.key === " ")) {
                  generateArray(array.length);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                width="24"
                viewBox="3 -2 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1 2.13-9" />
              </svg>
            </div>
          </div>
          <div className="toolbar-center">
            <label htmlFor="changeSize" id="arraySize" style={{ color }}>
              Array Size
            </label>

            <div className="slider-container" aria-live="off">
              <button
                className="slider-button negative"
                aria-label="Decrease array size"
                style={{ cursor }}
                disabled={isRunning}
                onClick={() => {
                  if (rangeValue > 0) {
                    const newValue = parseInt(rangeValue, 10) - 1;
                    this.setState({ rangeValue: newValue });
                    this.handleChange({ target: { value: newValue } });
                  }
                }}
              >
                -
              </button>
              <input
                id="changeSize"
                type="range"
                min="0"
                max="100"
                value={rangeValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={rangeValue}
                aria-label="Array size slider"
                style={{ background: color, cursor }}
                disabled={isRunning}
                onChange={this.handleChange}
              />
              <button
                className="slider-button positive"
                aria-label="Increase array size"
                style={{ cursor }}
                disabled={isRunning}
                onClick={() => {
                  if (rangeValue < 100) {
                    const newValue = parseInt(rangeValue, 10) + 1;
                    this.setState({ rangeValue: newValue });
                    this.handleChange({ target: { value: newValue } });
                  }
                }}
              >
                +
              </button>
            </div>
            <span
              aria-label="Current array length"
              style={{ fontFamily: "Inter", fontSize: 14 }}
            >
              {array.length}
            </span>
            <div className="separator" aria-hidden="true" />
            {this.state.sorted && !isRunning && (
              <button
                id="rewind"
                className="button-ghost"
                style={{ cursor }}
                onClick={this.rewindArray}
              >
                Rewind
              </button>
            )}
            {isRunning && (
              <button
                className="button-ghost"
                onClick={this.togglePause}
                aria-pressed={paused}
                aria-label={paused ? "Resume animation" : "Pause animation"}
                style={{ cursor: "pointer" }}
              >
                {paused ? "Resume" : "Pause"}
              </button>
            )}
          </div>
          <div className="toolbar-right">
            <SpeedControl
              value={speed}
              onChange={(val) => setSpeed(val)}
              disabled={isRunning}
            />
          </div>
        </div>
      </header>
    );
  }
}

export default Toolbar;

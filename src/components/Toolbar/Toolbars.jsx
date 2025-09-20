import React, { Component } from "react";
import "./Toolbar.css";

class Toolbar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      rangeValue: 50,
      originalArray: [],
      sorted: false,
      // selectedAlgorithms: [],
    };
  }

  componentDidMount() {
    const { generateArray } = this.props;

    generateArray(87);
    document.getElementById("changeSize").value = 50;
  }

  handleClick(algorithm) {   
    // this.setState(prevState => {
    //   const { selectedAlgorithms } = prevState;
    //   if (selectedAlgorithms.includes(algorithm)) {
    //     return {
    //       selectedAlgorithms: selectedAlgorithms.filter(a => a !== algorithm) // Deselect if already selected
    //     };
    //   }
    //   if (selectedAlgorithms.length >= 4) return null;
    //   return { selectedAlgorithms: [...selectedAlgorithms, algorithm] };
    // });
    const { selectedAlgorithms, updateSelectedAlgorithms } = this.props;
    if (selectedAlgorithms.includes(algorithm)) {
      updateSelectedAlgorithms(
        selectedAlgorithms.filter(a => a !== algorithm)
      );
    } else if (selectedAlgorithms.length < 4) {
      updateSelectedAlgorithms([...selectedAlgorithms, algorithm]);
    }
    // const { updateAlgorithm } = this.props;
    // this.setState({ sorted: false });
    // updateAlgorithm(algorithm);
  }

  handleChange(evt) {
    const { generateArray } = this.props;
    console.log(Math.floor((parseInt(evt.target.value) + 3) * 1.65));
    this.setState({ rangeValue: evt.target.value });
    generateArray(Math.floor((parseInt(evt.target.value) + 3) * 1.65));
  }

  rewindArray = () => {
    const { originalArray } = this.state;

    this.props.setArray(originalArray);
    this.setState({ sorted: false });
  }

  render() {
    const {
      array,
      algorithm,
      generateArray,
      sort,
      isRunning,
    } = this.props;

    const { rangeValue } = this.state;

    const speed = 570 - Math.pow(array.length, 2) > 0 ?
      570 - Math.pow(array.length, 2) : 0;

    const color = isRunning ? "rgba(214, 29, 29, 0.8)" : "white";

    const cursor = isRunning ? "auto" : "pointer";

    return (
      <div id="toolbar">
        <div
          id={!isRunning ? "generateArray" : "generateArrayX"}
          style={{color: color, cursor: cursor}}
          onClick={!isRunning ? () => generateArray(array.length) : null}>
          Generate New Array
        </div>
        <div className="separator"></div>
        <div
          id="arraySize"
          style={{color: color}}>
          Change Array Size & Sorting Speed
        </div>
        <input
          id="changeSize"
          type="range"
          min="0"
          max="100"
          value={rangeValue}
          style={{background: color, cursor: cursor}}
          disabled={isRunning ? "disabled" : null}
          onChange={this.handleChange}
          />
        <span>{this.state.rangeValue}</span>
        <div className="separator"></div>
        <div
          className={this.props.selectedAlgorithms.includes("mergeSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("mergeSort")}
        >
          Merge Sort
        </div>
        <div
          className={this.props.selectedAlgorithms.includes("quickSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("quickSort")}>
          Quick Sort
        </div>
        <div
          className={this.props.selectedAlgorithms.includes("heapSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("heapSort")}>
          Heap Sort
        </div>
        <div
          className={this.props.selectedAlgorithms.includes("bubbleSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("bubbleSort")}>
          Bubble Sort
        </div>
        {/* <div
          className={this.props.selectedAlgorithms.includes("selectionSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("selectionSort")}>
          Selection Sort
        </div>
        <div
          className={this.props.selectedAlgorithms.includes("insertionSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("insertionSort")}>
          Insertion Sort
        </div>
        <div
          className={this.props.selectedAlgorithms.includes("bucketSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("bucketSort")}>
          Bucket Sort
        </div>
        <div
          className={this.props.selectedAlgorithms.includes("countingSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("countingSort")}>
          Counting Sort
        </div>
        <div
          className={this.props.selectedAlgorithms.includes("radixSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("radixSort")}>
          Radix Sort
        </div>
        <div
          className={this.props.selectedAlgorithms.includes("shellSort") ? "currentAlgorithmButton" : "algorithmButton"}
          onClick={() => this.handleClick("shellSort")}>
          Shell Sort
        </div> */}
        <div className="separator"></div>
        { this.props.selectedAlgorithms.length >= 1 ? <div
            id="sort"
            style={{color: color, cursor: cursor}}
            onClick={!isRunning ? () => {
              const { array, sort, selectedAlgorithms } = this.props;
              // const { selectedAlgorithms } = this.state;

              this.setState({ originalArray: [...array], sorted: true });

              selectedAlgorithms.forEach(algo => {
                sort(algo, [...array], speed);
              })
              // sort(algorithm, array, speed);
            } : null}>
            Sort!
          </div> : null
        }
        <div className="separator"></div>
        {this.state.sorted && !isRunning && (
          <div
            id="rewind"
            style={{ color: color, cursor: cursor }}
            onClick={this.rewindArray}
          >
            Rewind
          </div>
        )}
      </div>
    )
  }
}

export default Toolbar;

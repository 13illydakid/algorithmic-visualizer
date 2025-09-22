import { Component } from "react";
import "./Body.css";

class Body extends Component {
  renderVisualization(algorithm, key, props) {
    const {
      array,
      currentBubbleTwo,
      currentQuickTwo,
      pivot,
      currentSwappers,
      currentHeapThree,
      currentSorted,
      currentMergeX,
    } = props;

  let highlightIndexes = [];

    switch (algorithm) {
      case "bubbleSort":
        highlightIndexes = currentBubbleTwo;
        break;
      case "quickSort":
        highlightIndexes = currentQuickTwo;
        break;
      case "heapSort":
        highlightIndexes = currentHeapThree;
        break;
      case "mergeSort":
        highlightIndexes = currentMergeX;
        break;
      default:
        break;
    }

    const numWidth = Math.floor(
      document.documentElement.clientWidth / (array.length * 3)
    );
    const width = `${numWidth}px`;
    const numMargin =
      array.length < 5
        ? 10
        : array.length < 8
        ? 8
        : array.length < 11
        ? 6
        : array.length < 20
        ? 4
        : array.length < 50
        ? 3.5
        : array.length < 100
        ? 3
        : array.length < 130
        ? 2.5
        : 2;
    const margin = `${numMargin}px`;
    const numFont =
      numWidth > 70
        ? 20
        : numWidth > 60
        ? 18
        : numWidth > 50
        ? 16
        : numWidth > 40
        ? 14
        : numWidth > 30
        ? 12
        : numWidth > 20
        ? 10
        : 8;
    const fontSize = `${numFont}px`;
  // Always show numbers; fade when very narrow
  const color = `rgba(255,255,255,${Math.min(1, Math.max(0.15, numWidth / 24))})`;

    return (
      <div className="visualizationWrapper" key={key}>
        {/* <div className="algoLabel">{label}</div> */}
        <div className="arrayContainer">
          {array.map((number, index) => {
            const backgroundColor = currentSwappers.includes(index)
              ? "rgba(219, 57, 57, 0.8)"
              : highlightIndexes.includes(index)
              ? "rgba(78, 216, 96, 0.8)"
              : pivot === index && algorithm === "quickSort"
              ? "rgba(237, 234, 59, 0.8)"
              : currentSorted.includes(index)
              ? "rgba(169, 92, 232, 0.8)"
              : // : "rgba(66, 134, 244, 0.8)";
                "rgba(224, 30, 238, 0.78)";
            return (
              <div
                className="arrayElement"
                key={index}
                style={{
                  height: `${number * 3}px`,
                  width: width,
                  marginLeft: `${margin}px`,
                  marginRight: `${margin}px`,
                  backgroundColor: backgroundColor,
                  color: color,
                  fontSize: `${fontSize}px`,
                }}
              >
                {number}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  render() {
    const props = this.props;
    const { selectedAlgorithms } = props;

    const numWidth = Math.floor(
      document.documentElement.clientWidth / (this.props.array.length * 3)
    );
    const width = `${numWidth}px`;
    const numMargin =
      this.props.array.length < 5
        ? 10
        : this.props.array.length < 8
        ? 8
        : this.props.array.length < 11
        ? 6
        : this.props.array.length < 20
        ? 4
        : this.props.array.length < 50
        ? 3.5
        : this.props.array.length < 100
        ? 3
        : this.props.array.length < 130
        ? 2.5
        : 2;
    const margin = `${numMargin}px`;
  const color = `rgba(255,255,255,${Math.min(1, Math.max(0.15, numWidth / 24))})`;
    const numFont =
      numWidth > 70
        ? 20
        : numWidth > 60
        ? 18
        : numWidth > 50
        ? 16
        : numWidth > 40
        ? 14
        : numWidth > 30
        ? 12
        : numWidth > 20
        ? 10
        : 8;
    const fontSize = `${numFont}px`;

    if (selectedAlgorithms.length <= 1) {
      return (
        <div id="bodiesContainer0">
          {/* <div class="arrayElement" style="height: 297px; width: 7px; margin-left: 3px; margin-right: 3px; background-color: rgba(66, 134, 244, 0.8); color: transparent; font-size: 8px;">99</div> */}

          {/* <div class="arrayElement" style="height: 303px; width: 7px; background-color: rgba(66, 134, 244, 0.8); color: transparent;">101</div> */}
          {this.props.array.length
            ? this.props.array.map((number, index) => {
                const backgroundColor = this.props.currentSwappers.includes(
                  index
                )
                  ? "rgba(219, 57, 57, 0.8)"
                  : // "rgba(183, 128, 238, 0.79)"
                  this.props.currentBubbleTwo.includes(index) ||
                    this.props.currentQuickTwo.includes(index) ||
                    this.props.currentHeapThree.includes(index) ||
                    this.props.currentMergeX.includes(index)
                  ? "rgba(78, 216, 96, 0.8)"
                  : // ?  "rgba(183, 128, 238, 0.60)"
                  this.props.pivot === index
                  ? "rgba(237, 234, 59, 0.8)"
                  : // ? "rgba(183, 128, 238, 0.45)"
                  this.props.currentSorted.includes(index)
                  ? "rgba(169, 92, 232, 0.8)"
                  : // ? "rgba(183, 128, 238, 0.3)"
                    "rgba(66, 134, 244, 0.8)";
                // : "rgba(224, 30, 238, 0.78)";
                return (
                  <div className="mirrored-array-container">
                    <div
                      className="arrayElement"
                      key={index}
                      style={{
                        height: `${number * 3}px`,
                        width: width,
                        marginLeft: margin,
                        marginRight: margin,
                        backgroundColor: backgroundColor,
                        color: color,
                        fontSize: fontSize,
                      }}
                    >
                      { number }
                    </div>
                    <hr className="break-line" />
                    <div
                      className="arrayElement-bottom"
                      key={index}
                      style={{
                        height: `${(210 - number) * 3}px`,
                        width: width,
                        marginLeft: margin,
                        marginRight: margin,
                        backgroundColor: backgroundColor,
                        color: color,
                        fontSize: fontSize,
                      }}
                    >
                      { number }
                    </div>
                  </div>
                );
              })
            : null}
        </div>
      );
    }
    return (
      <div id="bodiesContainer" className={`layout-${selectedAlgorithms.length}`}>
        {selectedAlgorithms.map((algorithm, idx) =>
          this.renderVisualization(algorithm, idx, props)
        )}
      </div>
    );
  }
}

export default Body;

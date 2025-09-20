import React, { Component } from "react";
import "./Sidebar.css";
import algorithmsMeta from "../../algorithms/meta";
import AlgorithmInfo from "../Info/AlgorithmInfo";

class Sidebar extends Component {
  handleClick = (newAlgorithm) => {
    const { updateAlgorithm, algorithm } = this.props;
    algorithm === newAlgorithm
      ? updateAlgorithm(null)
      : updateAlgorithm(newAlgorithm);
  };

  renderInfoPanel() {
    const { algorithm } = this.props;
    if (!algorithm) return null;
    return (
      <div
        id="infoContainer"
        aria-live="polite"
        aria-label={`${algorithm} information panel`}
      >
        <AlgorithmInfo id={algorithm} />
      </div>
    );
  }

  render() {
    const { algorithm } = this.props;

    return (
      <>
        <nav id="sortSidebar" aria-label="Sorting algorithms" role="navigation">
          {algorithmsMeta.map((algo) => (
            <div
              key={algo.id}
              className={
                algorithm === algo.id ? "sortOption-selected" : "sortOption"
              }
              role="button"
              tabIndex={0}
              aria-pressed={algorithm === algo.id}
              onClick={() => this.handleClick(algo.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  this.handleClick(algo.id);
                }
              }}
              title={algo.label}
            >
              {algo.label}
            </div>
          ))}
        </nav>
        {this.renderInfoPanel()}
      </>
    );
  }
}

export default Sidebar;

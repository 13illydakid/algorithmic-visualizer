import React, { Component } from "react";
import Toolbar from "./Toolbar/ToolbarContainer.js";
import StatusBar from "./Status/StatusBar.jsx";
import Legend from "./Status/Legend.jsx";
import Body from "./Body/BodyContainer.js";
import "./Main.css";
import Sidebar from "./Sidebar/SidebarContainer.js";

class Main extends Component {
  render() {
    const { algorithm } = this.props;
    // const showMergeInfo = algorithm === "mergeSort";
    const showInfo = [
      "mergeSort",
      "quickSort",
      "heapSort",
      "bubbleSort",
    ].includes(algorithm);

    return (
      <div>
        <Toolbar />
        <StatusBar />
        <Legend />
        <div className="mainContainer">
          <Sidebar />
          <div className={`arrayContainer ${showInfo ? "withInfo" : ""}`}>
            <Body />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

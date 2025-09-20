import React, { Component } from "react";
import Toolbar from "./Toolbar/ToolbarContainer.js";
import StatusBar from "./Status/StatusBar.jsx";
import Legend from "./Status/Legend.jsx";
import Body from "./Body/BodyContainer.js";
import "./Main.css";
import Sidebar from "./Sidebar/SidebarContainer.js";
import ProgressBar from "./Status/ProgressBar.jsx";

class Main extends Component {
  render() {
    return (
      <div>
        <Toolbar />
        <div className="top-meta-cluster">
          <div className="top-meta-inner">
            <StatusBar />
            <Legend />
            <ProgressBar />
          </div>
        </div>
        <div className="mainContainer">
          <Sidebar />
          <div className={`arrayContainer`}>
            <Body />
          </div>
        </div>
      </div>
    );
  }
}

export default Main;

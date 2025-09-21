import { Component } from "react";
import Body from "./Body/BodyContainer.js";
import "./Main.css";
import Sidebar from "./Sidebar/SidebarContainer.js";
import FPSMeter from "./Status/FPSMeter.jsx";
import Legend from "./Status/Legend.jsx";
import ProgressBar from "./Status/ProgressBar.jsx";
import StatusBar from "./Status/StatusBar.jsx";
import Toolbar from "./Toolbar/ToolbarContainer.js";

class Main extends Component {
  render() {
    return (
      <div className="app-root-flex">
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
          <div className="arrayContainer">
            <Body />
          </div>
        </div>
        <FPSMeter />
      </div>
    );
  }
}

export default Main;

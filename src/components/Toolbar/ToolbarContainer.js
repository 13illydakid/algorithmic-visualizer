import { connect } from "react-redux";
import { setAlgorithm } from "../../reducers/algorithm";
import { setArray } from "../../reducers/array";
import { setPaused } from "../../reducers/paused";
import { setSelectedAlgorithms } from "../../reducers/running/selectedAlgorithms/index.js";
import { setCurrentSorted } from "../../reducers/sorted";
import { setSpeed } from '../../reducers/speed';
import store from "../../store";
import { pauseActiveQueue, resumeActiveQueue, startSort } from "../../utils/sortRunner";
import Toolbar from "./Toolbar.jsx";

// speed reducer imported in root; value accessed via mapStateToProps

const mapStateToProps = (state) => ({
  array: state.array,
  algorithm: state.algorithm,
  isRunning: state.isRunning,
  selectedAlgorithms: state.selectedAlgorithms,
  speed: state.speed,
  paused: state.paused,
  turbo: state.turbo,
  stats: state.stats,
  perf: state.perf,
  eta: state.eta,
  progress: state.progress,
});

const mapDispatchToProps = (dispatch) => ({
  generateArray: (length) => {
    const array = [];
    while (array.length < length) {
      array.push(Math.floor(Math.random() * 200) + 10);
    }
    dispatch(setArray(array));
    dispatch(setCurrentSorted([]));
  },

  setArray: (arr) => {
    dispatch(setArray(arr));
    dispatch(setCurrentSorted([]));
  },

  setSpeed: (multiplier) => dispatch(setSpeed(multiplier)),

  updateSelectedAlgorithms: (algos) => dispatch(setSelectedAlgorithms(algos)),

  updateAlgorithm: (algorithm) => {
    dispatch(setAlgorithm(algorithm));
  },

  dispatchSetPaused: (val) => {
    dispatch(setPaused(val));
    if (val) pauseActiveQueue(); else resumeActiveQueue();
  },

  sort: (algorithm, array) => startSort(algorithm, array, dispatch, store.getState),
});

// ---------------- Queue Playback (migrated algorithms) ----------------
export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);

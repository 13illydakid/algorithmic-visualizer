import { connect } from "react-redux";
import { setAlgorithm } from "../../reducers/algorithm";
import store from "../../store";
import { startSort } from "../../utils/sortRunner";
import Sidebar from "./Sidebar";

const mapStateToProps = (state) => ({
  algorithm: state.algorithm,
  array: state.array,
  speed: state.speed,
  isRunning: state.isRunning,
});

const mapDispatchToProps = (dispatch) => ({
  updateAlgorithm: (algorithm) => dispatch(setAlgorithm(algorithm)),
  sortFromInfo: (algorithm, array) => startSort(algorithm, array, dispatch, store.getState)
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

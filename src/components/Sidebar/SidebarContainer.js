import { connect } from "react-redux";
import Sidebar from "./Sidebar";
import { setAlgorithm } from "../../reducers/algorithm";

const mapStateToProps = (state) => ({
  algorithm: state.algorithm, // make sure your reducer is correctly wired
});

const mapDispatchToProps = (dispatch) => ({
  updateAlgorithm: (algorithm) => dispatch(setAlgorithm(algorithm)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);

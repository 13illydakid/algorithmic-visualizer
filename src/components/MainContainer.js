import { connect } from "react-redux";
import Main from "./Main.jsx";

const mapStateToProps = (state) => ({
  algorithm: state.algorithm,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Main);

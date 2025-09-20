import { connect } from "react-redux";
// import Body from "./Bodies.jsx";
import Body from "./Body.jsx";

const mapStateToProps = ({
  selectedAlgorithms,
  array,
  currentBubbleTwo,
  currentQuickTwo,
  pivot,
  currentSwappers,
  currentHeapThree,
  currentSorted,
  currentMergeX,
  shellGap,
  shellIndices,
}) => ({
  selectedAlgorithms,
  array,
  currentBubbleTwo,
  currentQuickTwo,
  pivot,
  currentSwappers,
  currentHeapThree,
  currentSorted,
  currentMergeX,
  shellGap,
  shellIndices,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Body);

import { connect } from "react-redux";
// import Body from "./Bodies.jsx";
import Body from "./Body.jsx";

const mapStateToProps = ({
  selectedAlgorithms,
  algorithm,
  array,
  // All algorithm states
  currentBubbleTwo,
  currentQuickTwo,
  pivot,
  currentSwappers,
  currentHeapThree,
  currentSorted,
  currentMergeX,
  shellGap,
  shellIndices,
  // Previously missing algorithm states
  insertionSortReducer,
  selectionSort,
  selectionSortPivot,
  currentBucket,
  bucketAssignments,
  currentCountIndex,
  currentOutputIndex,
}) => ({
  selectedAlgorithms,
  algorithm,
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
  insertionSortReducer,
  selectionSort,
  selectionSortPivot,
  currentBucket,
  bucketAssignments,
  currentCountIndex,
  currentOutputIndex,
});

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Body);
